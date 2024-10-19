//@input Asset.RemoteServiceModule remoteServiceModule
//@input Component.Text3D text3DComponent
//@input SceneObject ColourPrefab

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
    try {
        instantiateObjects(exampleData);
    } catch (error) {
        print("Error during object instantiation: " + error);
    }
    // catFactChangeText();
    // instantiateObjects(exampleData);
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
        doctor_id: 69421
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


// Example data array
var exampleData = [
    { "color": "red", "value": "#f00" },
    { "color": "green", "value": "#0f0" },
    { "color": "blue", "value": "#00f" }
];

function instantiateObjects(data) {
    if (!script.ColourPrefab) {
        print("Prefab template is not assigned!");
        return;
    }

    // Iterate through the data array to create instances
    for (let i = 0; i < data.length; i++) {
        print("iterating through colour prefabs, index: " + i);
        const entry = data[i];

        try {
            // Create a new SceneObject for each instance
            const newObject = global.scene.createSceneObject('ColourVisual_' + i);
            newObject.setParent(script.getSceneObject());
            newObject.enabled = true;

            const positionOffset = new vec3(0, i * 2, 0);
            newObject.getTransform().setLocalPosition(positionOffset);

            print("New object instantiated at position: " + positionOffset);

            // Add a Text3D component to the new object if needed
            const text3DComponent = newObject.createComponent('Component.Text3D');
            if (text3DComponent && entry.color) {
                text3DComponent.text = entry.color + ": " + entry.value;
                print("Updated Text3D with: " + text3DComponent.text);
            } else {
                print("Text3D component not found or no color data.");
            }

            print("Instantiated object with color: " + entry.color + " and value: " + entry.value);
        } catch (instantiationError) {
            print("Error instantiating object at index " + i + ": " + instantiationError);
        }
    }
}


script.good = good;