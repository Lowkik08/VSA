var SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
var recognition = new SpeechRecognition();
var countdownElement = document.getElementById("countdown");
var gallery = document.getElementById("gallery");
var currentSelfieURI = ""; // Stores the last taken selfie URI

// Start voice recognition
function start() {
    document.getElementById("textbox").value = '';
    recognition.start();
}

// Handle speech recognition results
recognition.onresult = function (event) {
    var Content = event.results[0][0].transcript;
    document.getElementById("textbox").value = Content;

    if (Content.toLowerCase() === "take my selfie") {
        speak();
    }
};

// Speak out loud and start the countdown
function speak() {
    var synth = window.speechSynthesis;
    var speak_data = "Taking your selfie in 5 seconds";
    var utterThis = new SpeechSynthesisUtterance(speak_data);
    synth.speak(utterThis);

    Webcam.attach('#camera');

    var countdown = 5;
    var countdownInterval = setInterval(function () {
        countdownElement.innerText = countdown + " seconds remaining...";
        countdown--;
        if (countdown < 0) {
            clearInterval(countdownInterval);
            countdownElement.innerText = '';
            take_snapshot();
        }
    }, 1000);
}

// Configure webcam
Webcam.set({
    width: 360,
    height: 250,
    image_format: 'jpeg',
    jpeg_quality: 90
});

// Capture a snapshot
function take_snapshot() {
    Webcam.snap(function (data_uri) {
        currentSelfieURI = data_uri; // Store the current selfie URI
        document.getElementById("result").innerHTML = '<img id="selfie_image" src="' + data_uri + '" alt="Selfie">';
        addToGallery(data_uri);
        document.getElementById("share").style.display = "inline-block"; // Show the share button
    });
}

// Add captured selfie to the gallery
function addToGallery(data_uri) {
    var img = document.createElement("img");
    img.src = data_uri;
    img.alt = "Selfie";
    img.onclick = function () { downloadImage(data_uri); }; // Allow click-to-download
    gallery.appendChild(img);
}

// Download the captured selfie
function downloadImage(data_uri) {
    var link = document.createElement("a");
    link.href = data_uri;
    link.download = "selfie.jpg";
    link.click();
}

// Share the selfie using the Web Share API
function shareSelfie() {
    if (navigator.share && currentSelfieURI) {
        fetch(currentSelfieURI)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "selfie.jpg", { type: blob.type });
                navigator.share({
                    files: [file],
                    title: "My Selfie",
                    text: "Check out my awesome selfie!",
                })
                .then(() => console.log("Selfie shared successfully!"))
                .catch(err => console.error("Error sharing selfie: ", err));
            });
    } else {
        alert("Sharing is not supported on your device or browser!");
    }
}

// Clear the gallery
document.getElementById("clearGallery").onclick = function () {
    gallery.innerHTML = '';
};

// Toggle theme between light and dark mode
document.getElementById("themeToggle").onclick = function () {
    document.body.classList.toggle("dark-mode");
};
