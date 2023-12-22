import * as THREE from './Lib/three.module.min.js';
import { ARButton } from './Lib/webxr/ARButton.js';

document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {
        await initAR();
    };
    start();
});

async function initAR() {
    const xrButton = ARButton.createButton(new THREE.WebGLRenderer());
    document.body.appendChild(xrButton);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 20);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const animate = () => {
        if (xrButton.isPresenting) {
            renderer.setAnimationLoop(render);
        } else {
            requestAnimationFrame(animate);
            render();
        }
    };

    const render = () => {
        renderer.render(scene, camera);
    };

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}
