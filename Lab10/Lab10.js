document.addEventListener("DOMContentLoaded", () => {

        async function init() {

            const model = await handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands,
                {
                    runtime: 'mediapipe',
                    solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
                    modelType: 'full'
                });

            const webcam = new tmImage.Webcam(1000, 1000, true); // Set width and height to the window size
            let text = document.getElementById("text");

            await webcam.setup(); // request access to the webcam
            await webcam.play();

            document.body.appendChild(webcam.canvas);

            let skip = 1;

            async function loop() {
                skip++;
                webcam.update(); // update the webcam frame
                if (skip % 5 == 0) {
                    const prediction = await model.estimateHands(webcam.canvas);
                    if (prediction.length == 0)
                        text.innerHTML = "руки не видно";
                    else {
                        let str = "";
                        for (let hand = 0; hand < prediction.length; hand++) {
                            str += "<p>Визначено руку: " + prediction[hand]["handedness"] +
                                " з ймовірністю " + prediction[hand]["score"].toFixed(2) + "<br>";

                            // Calculate and display angles between fingers
                            for (let finger = 0; finger < prediction[hand]["keypoints"].length; finger++) {
                                str += "&nbsp;&nbsp;&nbsp;Палець: " +
                                    prediction[hand]["keypoints"][finger]["name"] + " (" +
                                    prediction[hand]["keypoints"][finger]["x"].toFixed(0) + ", " +
                                    prediction[hand]["keypoints"][finger]["y"].toFixed(0) + ")<br>";
                                if (finger < 4) {
                                    const angle = calculateAngle(prediction[hand]["keypoints"], finger);
                                    str += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Кут: " + angle.toFixed(2) + " градусів<br>";
                                }
                            }
                        }
                        text.innerHTML = str;
                    }
                }
                window.requestAnimationFrame(loop);
            }

            function calculateAngle(keypoints, fingerIndex) {
                const p1 = keypoints[fingerIndex * 4 + 0]; // fingertip
                const p2 = keypoints[fingerIndex * 4 + 1]; // dip
                const p3 = keypoints[fingerIndex * 4 + 2]; // pip

                const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
                const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

                const dotProduct = v1.x * v2.x + v1.y * v2.y;
                const magnitude1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
                const magnitude2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

                const cosTheta = dotProduct / (magnitude1 * magnitude2);
                const theta = Math.acos(cosTheta) * (180 / Math.PI);

                return theta;
            }

            window.requestAnimationFrame(loop);
        }

        init();
    });
