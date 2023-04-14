// Load the pre-trained model
posenet.load().then(function (net) {
    // Model loaded successfully
    console.log('Model loaded successfully');

    // Get the video element
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');

    // Create a canvas element to draw the video frame

    var ctx = canvas.getContext('2d');

    //get the input if set
    var myInput;

    // calculated height value
    var actualHeight;

    // Waist-Hip Ratio
    // average of the standard WHR values for males and females,
    // which are 0.9 or lower for males and 0.80 or lower for females
    // Waist Size = Hip Size * WHR
    const WHR = 0.85;

    // Function to get video stream
    function getVideoStream() {
        navigator.mediaDevices.getUserMedia({video: true}).then(function (stream) {
            // Set the video source and start playing
            video.srcObject = stream;
            video.play();
        }).catch(function (error) {
            console.error('Error accessing camera: ', error);
        });
    }

    // Function to estimate poses from video frames
    function estimatePoses() {
        // Draw video frame on canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the image data from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Convert the image data to a tensor
        const imageTensor = tf.browser.fromPixels(imageData);

        net.estimateSinglePose(imageTensor, {
            flipHorizontal: false, // Set to true if video is mirrored
            // decodingMethod: 'single-person', // Choose 'single-person' or 'multi-person'
        }).then(function (pose) {
            // Retrieve input value when input changes
            document.getElementById('myInput').addEventListener('input', function (event) {
                myInput = parseInt(event.target.value);
            });

            console.log(pose);

            // Calculate body dimensions
            // KEYPOINTS
            // 0: Nose
            // 1: Left Eye
            // 2: Right Eye
            // 3: Left Ear
            // 4: Right Ear
            // 5: Left Shoulder
            // 6: Right Shoulder
            // 7: Left Elbow
            // 8: Right Elbow
            // 9: Left Wrist
            // 10: Right Wrist
            // 11: Left Hip
            // 12: Right Hip
            // 13: Left Knee
            // 14: Right Knee
            // 15: Left Ankle
            // 16: Right Ankle

            // Calculate height as the distance between nose and leftAnkle
            var height = Math.abs(pose.keypoints[0].position.y - pose.keypoints[15].position.y);

            // Check if myInput has a value, otherwise use default value of 170
            actualHeight = (typeof myInput === "undefined" || myInput === null || myInput === '') ? 170 : myInput;

            //Conversion Factor = (Real-world Distance in cm) / (Size of Object in Pixels)
            const conversionFactor = actualHeight / height;

            // Calculate waist size as the distance between leftHip and rightHip multiplied by the conversionFactor and WHR
            var waistSize = Math.abs(pose.keypoints[12].position.x - pose.keypoints[11].position.x) * conversionFactor * WHR;

            // Calculate hip size as the distance between leftHip and rightHip multiplied by the conversionFactor
            var hipsSize = Math.abs(pose.keypoints[12].position.x - pose.keypoints[11].position.x) * conversionFactor;

            // Calculate chest size as the distance between leftShoulder and rightShoulder multiplied by the conversionFactor
            var chestSize = Math.abs(pose.keypoints[6].position.x - pose.keypoints[5].position.x) * conversionFactor;

            // Update the body dimensions on the web page
            document.getElementById('height').innerText = 'Height: ' + (height * conversionFactor).toFixed(2) + 'cm';
            document.getElementById('waistSize').innerText = 'Waist Size: ' + waistSize.toFixed(2) + 'cm';
            document.getElementById('hipsSize').innerText = 'Hips Size: ' + hipsSize.toFixed(2) + 'cm';
            document.getElementById('chestSize').innerText = 'Chest Size: ' + chestSize.toFixed(2) + 'cm';

            // Render the dimensions in your app's UI or display them in any other way you prefer
            console.log('Height:', height * conversionFactor);
            console.log('Waist Size:', waistSize);
            console.log('Hip Size:', hipsSize);
            console.log('Chest Size:', chestSize);

            // Call estimatePoses() again to process the next video frame
            requestAnimationFrame(estimatePoses);
        })
            .catch(function (error) {
                console.error('Pose estimation error:', error);
            });
    }

    // Call the getVideoStream function to start capturing video frames
    getVideoStream();

    // Call the estimatePoses function to start estimating poses from video frames
    estimatePoses();
}).catch(function (error) {
    console.error('Error loading model: ', error);
});
