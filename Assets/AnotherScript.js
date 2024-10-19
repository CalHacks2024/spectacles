
//@input Asset.RemoteServiceModule remoteServiceModule
//@input Component.Text3D text3DComponent

const SIK = require("SpectaclesInteractionKit/SIK").SIK;
const handInputData = SIK.HandInputData;

const rightHand = handInputData.getHand("right");
const leftHand = handInputData.getHand("left");

if (rightHand.isTracked() || leftHand.isTracked()) {
    print("yay hands!");
} else {
    print("no hands");
}

//can also do something like rightHand.isPinching()

//connecting a button
const good = function () {
    catFactChangeText();
    // print("gooooood");
    // fetchCatFact();
    // adiAPICall();
    // adiDoctorPost();
}

function catFactChangeText() {
    if (!script.remoteServiceModule) {
        print("RemoteServiceModule is not assigned!");
        return;
    }

    if (!script.text3DComponent) {
        print("Text3D component is not assigned!");
        return;
    }

    const httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = 'https://catfact.ninja/fact';
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;

    script.remoteServiceModule.performHttpRequest(httpRequest, function (response) {
        if (response.statusCode === 200) {
            const data = JSON.parse(response.body);
            print('Random Cat Fact: ' + data.fact);

            if (data.fact) {
                script.text3DComponent.text = data.fact;
                print('Updated Text3D with: ' + data.fact);
            } else {
                print('No text field found in response.');
            }
        } else {
            print('Failed to fetch cat fact. Status code: ' + response.statusCode);
        }
    });
}

//WORKS
// function fetchCatFact() {
//     if (!script.remoteServiceModule) {
//         print("RemoteServiceModule is not assigned!");
//         return;
//     }

//     const httpRequest = RemoteServiceHttpRequest.create();
//     httpRequest.url = 'https://catfact.ninja/fact';
//     httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;

//     script.remoteServiceModule.performHttpRequest(httpRequest, function (response) {
//         if (response.statusCode === 200) {
//             const data = JSON.parse(response.body);
//             print('Random Cat Fact: ' + data.fact);
//         } else {
//             print('Failed to fetch cat fact. Status code: ' + response.statusCode);
//         }
//     });
// }

function adiAPICall() {
    if (!script.remoteServiceModule) {
        print("RemoteServiceModule is not assigned!");
        return;
    }

    const httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = 'https://racer-grateful-shepherd.ngrok-free.app/startAppointment';
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Get;

    script.remoteServiceModule.performHttpRequest(httpRequest, function (response) {
        if (response.statusCode === 200) {
            const data = JSON.parse(response.body);
            print('Your appointment id: ' + data.appointment_id);
        } else {
            print('Failed to get appointment id: ' + response.statusCode);
        }
    });
}

function adiDoctorPost() {
    if (!script.remoteServiceModule) {
        print("RemoteServiceModule is not assigned!");
        return;
    }

    const httpRequest = RemoteServiceHttpRequest.create();
    httpRequest.url = 'https://racer-grateful-shepherd.ngrok-free.app/startAppointment';
    httpRequest.method = RemoteServiceHttpRequest.HttpRequestMethod.Post;

    const requestBody = JSON.stringify({
        doctor_id: 101010999
    });
    httpRequest.body = requestBody;

    httpRequest.setHeader('Content-Type', 'application/json');

    script.remoteServiceModule.performHttpRequest(httpRequest, function (response) {
        if (response.statusCode === 200) {
            const data = JSON.parse(response.body);
            print('Your appointment id: ' + data.appointment_id);
        } else {
            print('Failed to get appointment id: ' + response.statusCode);
        }
    });
}




script.good = good;