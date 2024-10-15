import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 0, 2);  // Bring the camera closer to the models
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let currentModel;

const darkPinkColor = 0x460a1c;

// Background color
scene.background = new THREE.Color(darkPinkColor);

const light = new THREE.AmbientLight(0xffddff, 1);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;  // Disable panning
controls.minPolarAngle = Math.PI / 4;  // Limit vertical rotation
controls.maxPolarAngle = Math.PI / 2;  // Limit vertical rotation

function animate() {
    requestAnimationFrame(animate);
    if (currentModel) {
        // currentModel.rotation.y += 0.01; // Rotate the model slowly
    }
    controls.update();  // Update controls for interaction
    renderer.render(scene, camera);
}

animate();

function loadModels(paths) {
    if (currentModel) {
        scene.remove(currentModel);  // Remove previous model if any
    }

    currentModel = new THREE.Group();  // Create a group to hold all models
    const loader = new GLTFLoader();
    const spacing = 0.5 / paths.length;  // Adjust spacing between models as needed

    paths.forEach((path, index) => {
        loader.load(path, (gltf) => {
            const model = gltf.scene;
            model.scale.set(2, 2, 2);  // Scale the model to make it bigger

            // Compute the bounding box of the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Adjust the model's position so that its center aligns with the origin
            model.position.set(-center.x, -center.y, -center.z);

            // Position models next to each other
            model.position.x += index * spacing;

            currentModel.add(model);
        }, undefined, (error) => {
            console.error('Error loading model:', error);
        });
    });

    scene.add(currentModel);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

export { loadModels };