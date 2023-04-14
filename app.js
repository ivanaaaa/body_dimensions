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
        // video.addEventListener('loadedmetadata', () => {
        // Draw video frame on canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get the image data from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Convert the image data to a tensor
        const imageTensor = tf.browser.fromPixels(imageData);

        // Wrap the image tensor in an array or a tensor array
        const inputTensor = tf.tensor([imageTensor]);

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
            var height = pose.keypoints[10].position.y - pose.keypoints[0].position.y;
            var waistSize = pose.keypoints[10].position.x - pose.keypoints[9].position.x;
            var hipsSize = pose.keypoints[12].position.x - pose.keypoints[11].position.x;
            var chestSize = pose.keypoints[14].position.x - pose.keypoints[13].position.x;

            // Check if myInput has a value, otherwise use default value of 170
            actualHeight = (typeof myInput === "undefined" || myInput === null || myInput === '') ? 170 : myInput;

            //Conversion Factor = (Real-world Distance in cm) / (Size of Object in Pixels)
            const conversionFactor = actualHeight / height;

            // Update the body dimensions on the web page
            document.getElementById('height').innerText = 'Height: '
                + (height * conversionFactor > 0
                    ? height * conversionFactor.toFixed(2)
                    : 0)
                + ' cm';

            document.getElementById('waistSize').innerText = 'Waist Size: '
                + (waistSize * conversionFactor > 0
                    ? waistSize * conversionFactor.toFixed(2)
                    : 0)
                + ' cm';

            document.getElementById('hipsSize').innerText = 'Hips Size: '
                + (hipsSize * conversionFactor > 0
                    ? hipsSize * conversionFactor.toFixed(2)
                    : 0)
                + ' cm';

            document.getElementById('chestSize').innerText = 'Chest Size: '
                + (chestSize * conversionFactor > 0
                    ? chestSize * conversionFactor.toFixed(2)
                    : 0)
                + ' cm';

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
