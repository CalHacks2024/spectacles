
//@input Asset.RemoteServiceModule remoteServiceModule

var SIK = require("SpectaclesInteractionKit/SIK").SIK;
var handInputData = SIK.HandInputData;

var rightHand = handInputData.getHand("right");
var leftHand = handInputData.getHand("left");

if (rightHand.isTracked() || leftHand.isTracked()) {
    print("yay hands!");
} else {
    print("no hands");
}

//can also do something like rightHand.isPinching()

//connecting a button
var good = function () {
    print("gooooood");
    fetchCatFact();
    adiAPICall();
}

function fetchCatFact() {
    if (!script.remoteServiceModule) {
        print("RemoteServiceModule is not assigned!");
        return;
    }

    var httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = 'https://catfact.ninja/fact';
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;

    script.remoteServiceModule.performHttpRequest(httpRequest, function (response) {
        if (response.statusCode === 200) {
            var data = JSON.parse(response.body);
            print('Random Cat Fact: ' + data.fact);
        } else {
            print('Failed to fetch cat fact. Status code: ' + response.statusCode);
        }
    });
}

function adiAPICall() {
    if (!script.remoteServiceModule) {
        print("RemoteServiceModule is not assigned!");
        return;
    }

    var httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = 'https://racer-grateful-shepherd.ngrok-free.app/startAppointment';
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;

    script.remoteServiceModule.performHttpRequest(httpRequest, function (response) {
        if (response.statusCode === 200) {
            var data = JSON.parse(response.body);
            print('Your appointment id: ' + data.appointment_id);
        } else {
            print('Failed to get appointment id: ' + response.statusCode);
        }
    });
}

script.good = good;