import * as THREE from './Lib/three.module.min.js';
        import { ARButton } from './Lib/webxr/ARButton.js';
        import { MindarImageThree } from 'mindar-image-three';

        document.addEventListener("DOMContentLoaded", () => {
            const start = async () => {
                console.log("Lab13");
                await initAR();
            };
            start();
        });

        async function initAR() {
            const xrButton = ARButton.createButton(new THREE.WebGLRenderer());
            document.body.appendChild(xrButton);

            const mindarImageThree = new MindarImageThree();
            const arController = await mindarImageThree.setupAR();
            
            const scene = new THREE.Scene();

            const lithiumGeometry = new THREE.SphereGeometry(0.3, 30, 30);
            const lithiumMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const lithium = new THREE.Mesh(lithiumGeometry, lithiumMaterial);
            scene.add(lithium);

            const electron1 = createElectron(0.5, 0.05, 0.05, 0x0000FF);
            electron1.position.setX(0.4 * Math.cos(Math.PI / 2));
            electron1.position.setY(0.4 * Math.cos(Math.PI / 4));
            electron1.position.setZ(0.4 * Math.sin(Math.PI / 2));
            scene.add(electron1);

            const electron2 = createElectron(0.8, 0.03, 0.1, 0xFFFF00);  
            electron2.position.set(0.8, 0, 0);
            scene.add(electron2);

            const electron3 = createElectron(1.1, 0.02, 0.15, 0x00FF00);  
            electron3.position.set(1.1, 0, 0);
            electron3.rotation.x = Math.PI / 2;
            scene.add(electron3);

            const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 20);
            camera.position.set(0, -3, -1);
            camera.lookAt(new THREE.Vector3(0, -3, -1));

            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            document.body.appendChild(renderer.domElement);

            function animate() {
                if (xrButton.isPresenting) {
                    renderer.setAnimationLoop(render);
                } else {
                    requestAnimationFrame(animate);
                    render();
                }
            }

            function render() {
                for (let electron of [electron1, electron2, electron3]) {
                    let radius = parseFloat(electron.userData.radius);
                    let speed = parseFloat(electron.userData.speed);
                    let time = Date.now() / 10;

                    if (electron === electron1) {
                        electron.position.setX(radius * Math.cos(speed * time));
                        electron.position.setY(radius * Math.sin(speed * time));
                        electron.position.setZ(0);
                    } else if (electron === electron2) {
                        electron.position.setX(0);
                        electron.position.setY(radius * Math.cos(speed * time));
                        electron.position.setZ(radius * Math.sin(speed * time));
                    } else if (electron === electron3) {
                        electron.position.setX(radius * Math.cos(speed * time));
                        electron.position.setY(0);
                        electron.position.setZ(radius * Math.sin(speed * time));
                    }
                }

                renderer.render(scene, camera);
            }

            animate();
        }

        function createElectron(animationRadius, animationSpeed, sphereRadius, color) {
            const electronGeometry = new THREE.SphereGeometry(sphereRadius, 30, 30);
            const electronMaterial = new THREE.MeshBasicMaterial({ color: color });
            const electron = new THREE.Mesh(electronGeometry, electronMaterial);
            setScale(electron);
            electron.userData = { radius: animationRadius, speed: animationSpeed };
            return electron;
        }

        function setScale(object) {
            // Implement your scaling logic if needed
        }
