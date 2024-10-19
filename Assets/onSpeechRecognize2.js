//@input Component.SpeechRecognition speechRecognitionComponent

function onSpeechRecognized(eventData) {
    var recognizedPhrase = eventData.text;
    print("Recognized speech: " + recognizedPhrase);

    // React based on the recognized phrase
    switch (recognizedPhrase) {
        case "Start":
            print("Action started!");
            // Add code for what should happen when "Start" is recognized
            break;

        case "Stop":
            print("Action stopped!");
            // Add code for what should happen when "Stop" is recognized
            break;

        case "Snap":
            print("Snapping...");
            // Add code for what should happen when "Snap" is recognized
            break;

        default:
            print("Unknown command: " + recognizedPhrase);
            break;
    }
}

// Register the function to handle the recognized speech event
script.speechRecognitionComponent.onRecognize.add(onSpeechRecognized);
