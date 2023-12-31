import * as THREE from './Lib/three.module.min.js';

document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {
        console.log("Lab8");
        await createAltModel();
    };
    start();
});

async function createAltModel() {
   
    const scene = new THREE.Scene();


    const lithiumGeometry = new THREE.SphereGeometry(3.0, 30, 30);
    const lithiumMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('assets/images/perlin-512.png') });
    const lithium= new THREE.Mesh(lithiumGeometry, lithiumMaterial);
    scene.add(lithium);

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


    addOrbit(scene, 5, 0x000000,  0, 0, 0); 
	addOrbit(scene, 8, 0x000000, 0, Math.PI / 2); 
	addOrbit(scene, 11, 0x000000, Math.PI / 2, 0, 0);


    const skyGeometry = new THREE.SphereGeometry(100, 30, 30);
    const skyMaterial = new THREE.MeshBasicMaterial({ color: 0x293134FF });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    scene.add(sky);


    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x8F8F8F, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -20;
    scene.add(plane);


    const main = createMain();
    scene.add(main);


    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 30, 10); 
    camera.lookAt(new THREE.Vector3(0, 0, 0)); 

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    function animate() {
    requestAnimationFrame(animate);

    for (let electron of [electron1, electron2, electron3]) {
        let radius = parseInt(electron.userData.radius);
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


function setScale(object) {
}

function createMain() {
    const main = new THREE.Object3D();
    main.userData = { angle: 0 };
    return main;
}
