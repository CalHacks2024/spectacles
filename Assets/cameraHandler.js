//@input Asset.RemoteServiceModule remoteServiceModule
//@input SceneObject CameraButton
//@input Component.Text3D textComponent {"label": "Button Text"}
//@input Component.Image ImageComponent
//@input SceneObject TakePhotoButton
//@input Asset.ObjectPrefab myPrefab


const SIK = require('SpectaclesInteractionKit/SIK').SIK;
let cameraModule = require('LensStudio:CameraModule');
const interactionConfiguration = SIK.InteractionConfiguration;
let cameraTexture = null

script.createEvent("OnStartEvent").bind(function() {
    print("gang shit")
    let cameraRequest = CameraModule.createCameraRequest();
    cameraRequest.id = CameraModule.CameraId.Left_Color;
    
    cameraTexture = cameraModule.requestCamera(cameraRequest);  
    script.ImageComponent.mainPass.baseTex = cameraTexture
})

function onAwake() {
    // Wait for other components to initialize by deferring to OnStartEvent.
    script.createEvent('OnStartEvent').bind(() => {
        onStart();
    });
}

function takePicture() {
    print("Picture Taken!")
    let instanceObject = script.myPrefab.instantiate(script.getSceneObject());
    let onNewFrame = cameraTexture.control.onNewFrame;
    let registration = onNewFrame.add((frame) => {
        onNewFrame.remove(registration)

        const width = cameraTexture.getWidth() // 1008
        const height = cameraTexture.getHeight() // 756
        const readableTexture = ProceduralTextureProvider.createFromTexture(cameraTexture)
        const readableProvider = readableTexture.control
        const data = new Uint8Array(width * height * 4)
        readableProvider.getPixels(0, 0, width, height, data)

        instanceObject.getComponent("Image").mainPass.baseTex = readableTexture
    });

}





function onStart() {
    // This script assumes that a ToggleButton (and Interactable + Collider) component have already been instantiated on the SceneObject.
    var pinchButton = script.TakePhotoButton.getComponent(
        interactionConfiguration.requireType('PinchButton')
    );
  
    var onStateChangedCallback = () => {
        try {
            takePicture();
        } catch(e){
            print(e)
        }
    };
    
    pinchButton.onButtonPinched.add(onStateChangedCallback);
}
  
onAwake();