import * as THREE from './Lib/three.module.min.js';
import { ARButton } from "three/addons/webxr/ARButton.js";

document.addEventListener("DOMContentLoaded", async () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    const commonPosition = new THREE.Vector3(0, 0, -0.5);

    const lithiumGeometry = new THREE.SphereGeometry(0.03, 30, 30);
    const lithiumMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('assets/images/perlin-512.png') });
    const lithium = new THREE.Mesh(lithiumGeometry, lithiumMaterial);
    lithium.position.copy(commonPosition);
    scene.add(lithium);

    const electron1 = createElectron(0.1, 0.05, 0.02, 0x0000FF);
    scene.add(electron1);

    const electron2 = createElectron(0.15, 0.03, 0.04, 0xFFFF00);
    scene.add(electron2);

    const electron3 = createElectron(0.2, 0.02, 0.06, 0x00FF00);
    scene.add(electron3);

    addOrbit(scene, 0.1, 0x000000, 0, 0, 0, commonPosition);
    addOrbit(scene, 0.15, 0x000000, 0, Math.PI / 2, commonPosition);
    addOrbit(scene, 0.2, 0x000000, Math.PI / 2, 0, 0, commonPosition);

    const skyGeometry = new THREE.SphereGeometry(1, 30, 30);
    const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x293134FF });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    sky.position.copy(commonPosition);
    scene.add(sky);

    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x8F8F8F, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.2;
    plane.position.copy(commonPosition);
    scene.add(plane);

    const main = createMain();
    main.position.copy(commonPosition);
    scene.add(main);

    camera.position.set(0, 0.2, 0.1);
    camera.lookAt(commonPosition);

    const arButton = ARButton.createButton(renderer, {
        optionalFeatures: ["dom-overlay"],
        domOverlay: { root: document.body }
    });

    document.body.appendChild(arButton);

    const controller = renderer.xr.getController(0);
    scene.add(controller);

    controller.addEventListener("select", () => {
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random() });
        const mesh = new THREE.Mesh(lithiumGeometry, material);
        mesh.position.applyMatrix4(controller.matrixWorld);
        mesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
        scene.add(mesh);
    });

    renderer.setAnimationLoop(() => {
        for (let electron of [electron1, electron2, electron3]) {
            let radius = parseFloat(electron.userData.radius);
            let speed = parseFloat(electron.userData.speed);
            let time = Date.now() / 500;

            electron.position.setX(radius * Math.cos(speed * time));
            electron.position.setY(radius * Math.sin(speed * time));
            electron.position.setZ(0);
        }

        renderer.render(scene, camera);
    });
});

function createElectron(animationRadius, animationSpeed, sphereRadius, color) {
    const electronGeometry = new THREE.SphereGeometry(sphereRadius, 30, 30);
    const electronMaterial = new THREE.MeshBasicMaterial({ color: color });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    electron.userData = { radius: animationRadius, speed: animationSpeed };
    return electron;
}

function addOrbit(scene, radius, color, rotationx, rotationy, position) {
    const orbitGeometry = new THREE.TorusGeometry(radius, 0.005, 30, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: color });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = rotationx;
    orbit.rotation.y = rotationy;
    orbit.position.copy(position);
    scene.add(orbit);
    return orbit;
}

function createMain() {
    const main = new THREE.Object3D();
    main.userData = { angle: 0 };
    return main;
}
