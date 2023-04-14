# Body Dimensions App
This is a simple web application for performing pose estimation on images using a pre-trained machine learning model. The app consists of an index.html file that serves as the entry point of the application, and an app.js file that contains the JavaScript code for performing pose estimation.

## Getting Started
To use the Pose Estimation App, follow these steps:

1. Clone the repository to your local machine using git clone or download the ZIP file and extract it.
2. Open the index.html file in a web browser.
3. The estimated poses will be displayed on the canvas in the form of keypoints and skeletons.
## Dependencies
The Pose Estimation App has the following dependencies:

* TensorFlow.js: A JavaScript library for training and running machine learning models in the browser.
* Posenet: A pre-trained machine learning model for pose estimation.
Both TensorFlow.js and Posenet are included as external scripts in the index.html file, so you do not need to separately install them.

## Customization
The app.js file contains the JavaScript code for performing pose estimation and body dimension calculation. You can customize the app by modifying the code in app.js according to your specific requirements. For example, you can adjust the parameters of the pose estimation algorithm, implement additional image processing or pose analysis logic, or integrate the app with other parts of your web application.

## Contributing
If you would like to contribute to the Body Dimensions App, please open an issue or submit a pull request on GitHub. Contributions are welcome and appreciated!

### Credits
The Pose Estimation App is based on the Posenet model and TensorFlow.js library. Credits to the original authors for their contributions to the open-source community.

### References
TensorFlow.js: https://www.tensorflow.org/js
Posenet: https://github.com/tensorflow/tfjs-models/tree/master/posenet
Note: Update the credits, references, and license sections with appropriate information based on your specific use case and licensing requirements.

### Code
Example to calculate the dimensions without using the keypoints indexes
```
// Get keypoint coordinates for specific body parts
const nose = pose.keypoints.find(keypoint => keypoint.part === 'nose').position;
const leftShoulder = pose.keypoints.find(keypoint => keypoint.part === 'leftShoulder').position;
const rightShoulder = pose.keypoints.find(keypoint => keypoint.part === 'rightShoulder').position;
const leftHip = pose.keypoints.find(keypoint => keypoint.part === 'leftHip').position;
const rightHip = pose.keypoints.find(keypoint => keypoint.part === 'rightHip').position;
const leftAnkle = pose.keypoints.find(keypoint => keypoint.part === 'leftAnkle').position;

// Calculate height as the distance between nose and leftAnkle
const height = Math.abs(nose.y - leftAnkle.y);

// Calculate waist size as the distance between leftHip and rightHip
const waistSize = Math.abs(leftHip.x - rightHip.x);

// Calculate hip size as the distance between leftHip and rightHip
const hipsSize = Math.abs(leftHip.x - rightHip.x);

// Calculate chest size as the distance between leftShoulder and rightShoulder
const chestSize = Math.abs(leftShoulder.x - rightShoulder.x);
```