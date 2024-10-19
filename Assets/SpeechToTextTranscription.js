//@input Asset.VoiceMLModule vmlModule {"label": "Voice ML Module"}

var options = VoiceML.ListeningOptions.create();

var accumulatedTranscript = "";

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



