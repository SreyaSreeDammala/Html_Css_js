var i = 0;  // This will track whether the mic is on or off
var recognition;

function speechToTextConversion() {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert('Your browser does not support Speech Recognition. Please use a compatible browser like Google Chrome or Microsoft Edge.');
        return;
    }

    // Initialize the recognition object if not already initialized
    if (!recognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;  // Keep listening until manually stopped
        recognition.lang = 'en-IN';     // Set the language (change if needed)
        recognition.interimResults = false; // Only final results, no intermediate transcriptions
        recognition.maxAlternatives = 1;  // Only take the most accurate result

        recognition.onresult = function (event) {
            var last = event.results.length - 1;  // Get the last result (final transcribed speech)
            var convertedText = event.results[last][0].transcript; // Final transcribed speech text
            var diagnostic = document.getElementById('text');
            
            // Append the new speech to the textarea
            diagnostic.value += convertedText + ' ';
            diagnostic.scrollTop = diagnostic.scrollHeight; // Scroll to the bottom
            console.log('Recognized text: ', convertedText);
        };

        recognition.onnomatch = function () {
            var diagnostic = document.getElementById('text');
            diagnostic.value = 'I didn\'t recognize that.';
        };

        recognition.onerror = function (event) {
            var diagnostic = document.getElementById('text');
            diagnostic.value = 'Error occurred in recognition: ' + event.error;
        };

        recognition.onend = function () {
            // Restart recognition automatically if it stops
            if (i === 1) { // If mic is still on
                recognition.start();
            }
        };
    }

    // Toggle the mic button to start/stop recording
    document.getElementById("playButton").onclick = function () {
        if (i === 0) {
            document.getElementById("playButton").src = "record-button-thumb.png"; // Change icon to recording
            recognition.start();
            i = 1;
        } else {
            document.getElementById("playButton").src = "mic.png"; // Revert to default mic icon
            recognition.stop();
            i = 0;
        }
    };
}

// Optional: Copy button functionality to copy the content of the textarea
document.getElementById("copyButton").onclick = function() {
    var copyText = document.getElementById("text"); // Get the textarea element
    copyText.select(); // Select the text inside the textarea
    copyText.setSelectionRange(0, 99999); // For mobile devices

    try {
        // Copy the selected text to clipboard
        document.execCommand("copy");
        alert("Text copied to clipboard!");
    } catch (err) {
        alert("Unable to copy text: " + err);
    }
};

// Initialize the speech-to-text functionality
speechToTextConversion();
