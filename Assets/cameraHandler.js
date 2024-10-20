//@input Asset.RemoteServiceModule remoteServiceModule
//@input SceneObject CameraButton
//@input Component.Text3D textComponent {"label": "Button Text"}
//@input Component.Image ImageComponent

const SIK = require('SpectaclesInteractionKit/SIK').SIK;
let cameraModule = require('LensStudio:CameraModule');

const interactionConfiguration = SIK.InteractionConfiguration;

script.createEvent("OnStartEvent").bind(function() {
    print("gang shit")
    let cameraRequest = CameraModule.createCameraRequest();
    cameraRequest.id = CameraModule.CameraId.Left_Color;
    
    let cameraTexture = cameraModule.requestCamera(cameraRequest);  
    script.ImageComponent.mainPass.baseTex = cameraTexture
})

// function onAwake() {
//     // Wait for other components to initialize by deferring to OnStartEvent.
//     script.createEvent('OnStartEvent').bind(() => {
//         onStart();
//     });
// }

// function takePicture() {
//     print("Picture Taken!")
//     let cameraRequest = cameraModule.createCameraRequest();
//     cameraRequest.cameraId = cameraModule.CameraId.Left_Color;

//     let cameraTexture = cameraModule.requestCamera(cameraRequest);
//     script.ImageComponent.mainPass.baseTex = cameraTexture

//     let onNewFrame = cameraTexture.control.onNewFrame;
//     let registration = onNewFrame.add((frame) => {
//         // Process the frame
//     });

//     script.onStop.add(() => onNewFrame.remove(registration));
// }

// function onStart() {
//     // This script assumes that a ToggleButton (and Interactable + Collider) component have already been instantiated on the SceneObject.
//     var pinchButton = script.CameraButton.getComponent(
//         interactionConfiguration.requireType('PinchButton')
//     );
  
//     var onStateChangedCallback = () => {
//         takePicture();
//     };
    
//     pinchButton.onButtonPinched.add(onStateChangedCallback);
// }
  
// onAwake();