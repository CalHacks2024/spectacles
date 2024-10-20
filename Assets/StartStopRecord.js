//@input Asset.VoiceMLModule vmlModule {"label": "Voice ML Module"}
//@input Asset.RemoteServiceModule remoteServiceModule
//@input SceneObject StartRecordButton
//@input Component.Text3D textComponent {"label": "Button Text"}

const SIK = require('SpectaclesInteractionKit/SIK').SIK;
const interactionConfiguration = SIK.InteractionConfiguration;

// Listening options for the VoiceML
var options = VoiceML.ListeningOptions.create();
options.speechRecognizer = VoiceMLModule.SpeechRecognizer.Default;
options.languageCode = 'en_US';
options.shouldReturnAsrTranscription = true;
options.shouldReturnInterimAsrTranscription = true;

var accumulatedTranscript = "";
var count = 5;
var isRecording = false;

// Handler for enabling listening
var onListeningEnabledHandler = function () {
    script.vmlModule.startListening(options);
};

// Handler for disabling listening
var onListeningDisabledHandler = function () {
    script.vmlModule.stopListening();
};

// Error handling
var onListeningErrorHandler = function (eventErrorArgs) {
    print('Error: ' + eventErrorArgs.error + ' desc: ' + eventErrorArgs.description);
};

// Handle transcription updates
var onUpdateListeningEventHandler = function (eventArgs) {
    if (eventArgs.transcription.trim() === '') {
        return;
    }

    if (!eventArgs.isFinalTranscription) {
        return;
    }

    if(!isRecording){
        return;
    }
    
    accumulatedTranscript += eventArgs.transcription + ' ';
    count -= 1;
    print(count + ' is the count');

    if (count === 0) {
        print("Sending transcript...");
        sendTranscript(accumulatedTranscript);
        count = 5;
    }

    print('Final Transcription: ' + eventArgs.transcription);
    print('Accumulated Transcription: ' + accumulatedTranscript);
};

// Function to send the accumulated transcript to the remote service
function sendTranscript(transcript) {
    const httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = 'https://racer-grateful-shepherd.ngrok-free.app/sendTranscript';
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Post;
    const reqBody = JSON.stringify({
        transcript: transcript,
        appointment_id: '123456789', // Replace with actual appointment ID as needed
    });
    httpRequest.body = reqBody;
    httpRequest.setHeader('Content-Type', 'application/json');

    script.remoteServiceModule.performHttpRequest(httpRequest, function (response) {
        if (response.statusCode === 200) {
            print("Transcript successfully sent!");
            print(response.body)
        } else {
            print("Failed to send transcript. Status code: " + response.statusCode);
        }
    });
}

// Function to toggle recording when the button is pressed
function toggleRecording() {
    if (isRecording) {
        //onListeningDisabledHandler(); // Stop listening
        updateButtonText("Start Recording");
    } else {
        //onListeningEnabledHandler(); // Start listening
        updateButtonText("Stop Recording");
        accumulatedTranscript = ""
    }
    
    isRecording = !isRecording;
    print(isRecording ? "Started recording..." : "Stopped recording...");
}

function updateButtonText(newText) {
    if (script.textComponent) {
        script.textComponent.text = newText;
    } else {
        print("Text component is not assigned!")
    }
}

// Attach the toggle function to the record button's press event
//script.StartRecordButton.onPress = toggleRecording;

// updateButtonText("Start Recording fuck")

// VoiceML Callbacks
script.vmlModule.onListeningUpdate.add(onUpdateListeningEventHandler);
script.vmlModule.onListeningError.add(onListeningErrorHandler);
script.vmlModule.onListeningEnabled.add(onListeningEnabledHandler);
script.vmlModule.onListeningDisabled.add(onListeningDisabledHandler);


function onAwake() {
    // Wait for other components to initialize by deferring to OnStartEvent.
    script.createEvent('OnStartEvent').bind(() => {
        onStart();
    });
    script.vmlModule.stopListening();
}

function onStart() {
    // This script assumes that a ToggleButton (and Interactable + Collider) component have already been instantiated on the SceneObject.
    var pinchButton = script.StartRecordButton.getComponent(
        interactionConfiguration.requireType('PinchButton')
    );
  
    var onStateChangedCallback = () => {
        toggleRecording();
    };
    
    updateButtonText("Start Recording")
    pinchButton.onButtonPinched.add(onStateChangedCallback);
}
  
onAwake();