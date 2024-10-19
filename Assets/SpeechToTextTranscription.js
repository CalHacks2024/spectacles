//@input Asset.VoiceMLModule vmlModule {"label": "Voice ML Module"}
//@input Asset.RemoteServiceModule remoteServiceModule

const SIK = require("SpectaclesInteractionKit/SIK").SIK;

var options = VoiceML.ListeningOptions.create();

var accumulatedTranscript = "";
var count = 5;

var onListeningEnabledHandler = function () {
    script.vmlModule.startListening(options);
  };
  
var onListeningDisabledHandler = function () {
    script.vmlModule.stopListening();
};

var onListeningErrorHandler = function (eventErrorArgs) {
    print(
      'Error: ' + eventErrorArgs.error + ' desc: ' + eventErrorArgs.description
    );
};

// var onUpdateListeningEventHandler = function(eventArgs) {
//     print("onUpdate beinbg called");
//     print(JSON.stringify(eventArgs) + "are the event args");
// };

var onUpdateListeningEventHandler = function (eventArgs) {
    if (eventArgs.transcription.trim() == '') {
      return;
    }
    //print('Transcription: ' + eventArgs.transcription);
  
    if (!eventArgs.isFinalTranscription) {
      return;
    }
    accumulatedTranscript += eventArgs.transcription + ' ';
    count -= 1;
    print(count + ' is the count')
    if (count === 0) {
      print("within...")
      const httpRequest = RemoteServiceHttpRequest.create();
      httpRequest.url = 'https://racer-grateful-shepherd.ngrok-free.app/sendTranscript';
      httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Post;
      const reqBody = JSON.stringify({
        transcript: accumulatedTranscript,
        appointment_id: '123456789',
      });
      httpRequest.body = reqBody;
      httpRequest.setHeader('Content-Type', 'application/json');

      script.remoteServiceModule.performHttpRequest(httpRequest, function (response) {
        if (response.statusCode === 200) {
          print("transcript successfully sent!")
        } else {
          print("failed to send transcript. status code: " + response.statusCode)
        }
      })
      accumulatedTranscript = "";
      count = 5;
    }
    print('Final Transcription: ' + eventArgs.transcription);
    print('Accumulated Transcription: ' + accumulatedTranscript);
};


//VoiceML Callbacks
script.vmlModule.onListeningUpdate.add(onUpdateListeningEventHandler);
script.vmlModule.onListeningError.add(onListeningErrorHandler);
script.vmlModule.onListeningEnabled.add(onListeningEnabledHandler);
script.vmlModule.onListeningDisabled.add(onListeningDisabledHandler);

options.speechRecognizer = VoiceMLModule.SpeechRecognizer.Default;

options.languageCode = 'en_US';

//General Option for Transcription
options.shouldReturnAsrTranscription = true;

options.shouldReturnInterimAsrTranscription = true;
options.shouldReturnAsrTranscription = true;



