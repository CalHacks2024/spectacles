//@input Asset.VoiceMLModule vmlModule {"label": "Voice ML Module"}
//@input Asset.RemoteServiceModule remoteServiceModule
//@input SceneObject StartRecordButton
//@input SceneObject CameraButton
//@input SceneObject HideButton
//@input SceneObject CameraWindow
//@input SceneObject WhiteBoard
//@input Component.Text3D textComponent {"label": "Button Text"}
//@input SceneObject Window1
//@input Component.Text Window1text
//@input Component.Text Window1title
//@input SceneObject Window2
//@input Component.Text Window2text
//@input Component.Text Window2title
//@input SceneObject Window3
//@input Component.Text Window3text
//@input Component.Text Window3title
//@input SceneObject Window4
//@input Component.Text Window4text
//@input Component.Text Window4title
//@input SceneObject Window5
//@input Component.Text Window5text
//@input Component.Text Window5title



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
            print(response.body.data)
            if(response.body.data) {
                print("here")
                for(let i = 0; i < response.body.data.length; i++ ) {
                    let id = response.body[i].id
                    if(id == 1) {
                        script.Window1.enabled = true;
                        script.Window1text = response.body.data[i].body
                        script.Window1title = response.body.data[i].title
                    } else if(id == 2) {
                        script.Window2.enabled = true;
                        script.Window2text = response.body.data[i].body
                        script.Window2title = response.body.data[i].title
                    } else if (id == 3) {
                        script.Window3.enabled = true;
                        script.Window3text = response.body.data[i].body
                        script.Window3title = response.body.data[i].title
                    } else if (id == 4) {
                        script.Window4.enabled = true;
                        script.Window4text = response.body.data[i].body
                        script.Window4title = response.body.data[i].title
                    } else {
                        script.Window5.enabled = true;
                        script.Window5text = response.body.data[i].body
                        script.Window5title = response.body.data[i].title
                    }
                }   
            }
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

function toggleCamera() {
    script.CameraWindow.enabled = !script.CameraWindow.enabled;
}

function toggleBoard() {
    script.WhiteBoard.enabled = !script.WhiteBoard.enabled;
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

    var pinchButton2 = script.CameraButton.getComponent(
        interactionConfiguration.requireType('PinchButton')
    );

    var pinchButton3 = script.HideButton.getComponent(
        interactionConfiguration.requireType('PinchButton')
    );
  
  
    var onStateChangedCallback = () => {
        toggleRecording();
    };
    
    var onStateChangedCallback2 = () => {
        toggleCamera();
    };

    var onStateChangedCallback3 = () => {
        toggleBoard();
    };

    updateButtonText("Start Recording")
    pinchButton.onButtonPinched.add(onStateChangedCallback);
    pinchButton2.onButtonPinched.add(onStateChangedCallback2);
    pinchButton3.onButtonPinched.add(onStateChangedCallback3);

}
  
onAwake();