import * as THREE from './Lib/three.module.min.js';

import { MindARThree } from './Lib/mind/mindar-image-three.prod.js';

document.addEventListener("DOMContentLoaded", () => {
    const start = async() =>
    {
        console.log("Lab8")
        await createAltModel();
    }
    start();
});

async function createAltModel()
{
    // Создаем сцену
    // Создаем экземпляр MindARThree
    const mindarThree = new MindARThree({
        container: document.body,
        imageTargetSrc: 'assets/markers/rutherford/rutherford.mind',
        uiLoading: "no",
        uiScanning: "yes",
        uiError: "yes",
        debug: "yes",
    });

    const {scene, camera, renderer } = mindarThree;

    const anchor = mindarThree.addAnchor(0);

    // Добавляем ядро атома
    const lithiumGeometry = new THREE.SphereGeometry(3.0, 30, 30);
    const lithiumMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('assets/images/perlin-512.png') });
    const lithium= new THREE.Mesh(lithiumGeometry, lithiumMaterial);
	setScale(lithium);
    scene.add(lithium);

    // Добавляем электроны
    const electron1 = createElectron(5, 0.5, 0.5, 0x0000FF); 
    electron1.position.setX(4 * Math.cos(Math.PI / 2));
    electron1.position.setY(4 * Math.cos(Math.PI / 4));
    electron1.position.setZ(4 * Math.sin(Math.PI / 2));
    scene.add(electron1);

    const electron2 = createElectron(8, 0.3, 1.0, 0xFFFF00);  
    electron2.position.set(8, 0, 0);
    scene.add(electron2);

    const electron3 = createElectron(11, 0.2, 1.5, 0x00FF00);  
    electron3.position.set(11, 0, 0);
    electron3.rotation.x = Math.PI / 2;
    scene.add(electron3);

    // Добавляем орбиты
    const orbit1 = addOrbit(scene, 5, 0x000000,  0, 0, 0); 
    const orbit2 = addOrbit(scene, 8, 0x000000, 0, Math.PI / 2); 
    const orbit3 = addOrbit(scene, 11, 0x000000, Math.PI / 2, 0, 0);

    renderer.setAnimationLoop(() =>
    {
        for (let electron of [electron1, electron2, electron3]) {
        let radius = parseInt(  electron.userData.radius) * electron.scale.getComponent(0);
        let speed  = parseFloat(electron.userData.speed);
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
    })

    anchor.group.add(lithium, electron1, electron2, electron3, orbit1, orbit2, orbit3);


    await mindarThree.start();
}

function createElectron(animationRadius, animationSpeed, sphereRadius, color) {
    const electronGeometry = new THREE.SphereGeometry(sphereRadius, 30, 30);
    const electronMaterial = new THREE.MeshBasicMaterial({ color: color });
    const electron = new THREE.Mesh(electronGeometry, electronMaterial);
    setScale(electron);
    electron.userData = { radius: animationRadius, speed: animationSpeed };
    return electron;
}
function addOrbit(scene, radius, color, rotationx, rotationy) {
    const orbitGeometry = new THREE.TorusGeometry(radius, 0.1, 30, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({ color: color });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    setScale(orbit);
    orbit.rotation.x = rotationx;
    orbit.rotation.y = rotationy; 
    scene.add(orbit);
    return orbit;
}

function setScale(object)
{
    object.scale.set(0.03, 0.03, 0.03);
}