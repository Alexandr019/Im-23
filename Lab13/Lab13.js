import * as THREE from './Lib/three.module.min.js';
import { ARButton } from './Lib/webxr/ARButton.js';

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

    const scene = document.querySelector("a-scene");
    const modelContainer = document.getElementById("modelContainer");

    const lithium = document.createElement("a-sphere");
    lithium.setAttribute("radius", "0.3");
    lithium.setAttribute("position", "0 0 0");
    lithium.setAttribute("material", "src: assets/images/perlin-512.png");
    modelContainer.appendChild(lithium);

    const electron1 = createElectronAFrame(0.5, 0.05, 0.05, 0x0000FF);
    electron1.setAttribute("position", "0 0 0");
    modelContainer.appendChild(electron1);

    const electron2 = createElectronAFrame(0.8, 0.03, 0.1, 0xFFFF00);
    electron2.setAttribute("position", "0.8 0 0");
    modelContainer.appendChild(electron2);

    const electron3 = createElectronAFrame(1.1, 0.02, 0.15, 0x00FF00);
    electron3.setAttribute("position", "1.1 0 0");
    modelContainer.appendChild(electron3);

    addOrbitAFrame(modelContainer, 0.5, 0x000000, 0, 0, 0);
    addOrbitAFrame(modelContainer, 0.8, 0x000000, 0, Math.PI / 2);
    addOrbitAFrame(modelContainer, 1.1, 0x000000, Math.PI / 2, 0, 0);

    const sky = document.createElement("a-sphere");
    sky.setAttribute("radius", "10");
    sky.setAttribute("material", "color: #293134FF");
    scene.appendChild(sky);

    const plane = document.createElement("a-plane");
    plane.setAttribute("width", "10");
    plane.setAttribute("height", "10");
    plane.setAttribute("color", "#8F8F8F");
    plane.setAttribute("rotation", "-90 0 0");
    plane.setAttribute("position", "0 -2 0");
    scene.appendChild(plane);

    const main = document.createElement("a-entity");
    modelContainer.appendChild(main);

    const camera = document.createElement("a-camera");
    camera.setAttribute("position", "0 -3 -1");
    camera.setAttribute("look-controls", "");
    modelContainer.appendChild(camera);

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
                electron.setAttribute("position", {
                    x: radius * Math.cos(speed * time),
                    y: radius * Math.sin(speed * time),
                    z: 0
                });
            } else if (electron === electron2) {
                electron.setAttribute("position", {
                    x: 0,
                    y: radius * Math.cos(speed * time),
                    z: radius * Math.sin(speed * time)
                });
            } else if (electron === electron3) {
                electron.setAttribute("position", {
                    x: radius * Math.cos(speed * time),
                    y: 0,
                    z: radius * Math.sin(speed * time)
                });
            }
        }

        // renderer.render(scene, camera);
    }

    animate();
}

function createElectronAFrame(animationRadius, animationSpeed, sphereRadius, color) {
    const electron = document.createElement("a-sphere");
    electron.setAttribute("radius", sphereRadius);
    electron.setAttribute("color", color);
    setScaleAFrame(electron);
    electron.userData = { radius: animationRadius, speed: animationSpeed };
    return electron;
}

function addOrbitAFrame(scene, radius, color, rotationx, rotationy) {
    const orbit = document.createElement("a-torus");
    orbit.setAttribute("radius", radius);
    orbit.setAttribute("radius-tubular", "0.01");
    orbit.setAttribute("material", `color: ${color}`);
    setScaleAFrame(orbit);
    orbit.setAttribute("rotation", `${rotationx} ${rotationy} 0`);
    scene.appendChild(orbit);
    return orbit;
}

function setScaleAFrame(object) {
    // Implement your scaling logic if needed
}

function createMainAFrame() {
    const main = document.createElement("a-entity");
    main.userData = { angle: 0 };
    return main;
}

