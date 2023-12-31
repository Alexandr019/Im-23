import * as THREE from './Lib/three.module.min.js';
import { ARButton } from './Lib/webxr/ARButton.js';

document.addEventListener('DOMContentLoaded', async () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 20);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    const lithiumGeometry = new THREE.SphereGeometry(0.3, 30, 30);
    const lithiumMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('assets/images/perlin-512.png') });
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

    addOrbit(scene, 0.5, 0x000000, 0, 0, 0);
    addOrbit(scene, 0.8, 0x000000, 0, Math.PI / 2);
    addOrbit(scene, 1.1, 0x000000, Math.PI / 2, 0, 0);

    const main = createMain();
    scene.add(main);

    camera.position.set(0, 3, 1);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const arButton = ARButton.createButton(renderer, {
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.body },
    });

    document.body.appendChild(arButton);

    const controller = renderer.xr.getController(0);
    scene.add(controller);

    controller.addEventListener('select', () => {
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
    });
});

function createElectron(animationRadius, animationSpeed, sphereRadius, color) {
    const electronGeometry = new THREE.SphereGeometry(sphereRadius, 30, 30);
    const electronMaterial = new THREE.MeshBasicMaterial({ color: color });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    setScale(electron);
    electron.userData = { radius: animationRadius, speed: animationSpeed };
    return electron;
}

function addOrbit(scene, radius, color, rotationx, rotationy) {
    const orbitGeometry = new THREE.TorusGeometry(radius, 0.01, 30, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: color });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    setScale(orbit);
    orbit.rotation.x = rotationx;
    orbit.rotation.y = rotationy;
    scene.add(orbit);
    return orbit;
}

function setScale(object) {
    // Implement scaling logic if needed
}

function createMain() {
    const main = new THREE.Object3D();
    main.userData = { angle: 0 };
    return main;
}
