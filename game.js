import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { GUI } from 'dat.gui';

let scene, camera, renderer, whiteBloodCell, controls;
let uniforms, vesselUniforms, background, ground;
let viruses = [], powerUps = [];
let health = 100, score = 0;
let healthBar, scoreText;

// Textures
const textureLoader = new THREE.TextureLoader();
const cellTexture = textureLoader.load('static/white_blood_cell.jpg');
const vesselTexture = textureLoader.load('static/blood_vessel.jpg');

let mouseY = 0;
let targetY = 0;
const dampingFactor = 0.1;

document.addEventListener('mousemove', (event) => {
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    //scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    pointLight.castShadow = true; // Enable shadows for the point light
    pointLight.shadow.mapSize.width = 1024; // Shadow map resolution
    pointLight.shadow.mapSize.height = 1024;
    pointLight.shadow.camera.near = 0.5; // Shadow camera near plane
    pointLight.shadow.camera.far = 500; // Shadow camera far plane
    scene.add(pointLight);

    // Uniforms for the shader
    uniforms = {
        u_time: { type: 'f', value: 0.0 },
        u_frequency: { type: 'f', value: 5 },
        u_red: { type: 'f', value: 255 / 255 },
        u_green: { type: 'f', value: 20 / 255 },
        u_blue: { type: 'f', value: 60 / 255 }
    };

    const redColor = new THREE.Color(1, 0, 0);

    // White Blood Cell
    const bloodTexture = new THREE.DataTexture(new Uint8Array([220, 20, 60]), 1, 1, THREE.RGBFormat);
    const geometry = new THREE.IcosahedronGeometry(1, 15);
    const material = new THREE.ShaderMaterial({
        uniforms: { ...uniforms, u_texture: { value: cellTexture } },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
    });
    whiteBloodCell = new THREE.Mesh(geometry, material);
    whiteBloodCell.position.x = -8;
    scene.add(whiteBloodCell);

    // Ground
    const cylinder_geometry = new THREE.CylinderGeometry(10, 10, 40, 32);
    const cylinder_material = new THREE.MeshBasicMaterial({ map: vesselTexture, color: redColor, side: THREE.DoubleSide });
    const cylinder = new THREE.Mesh(cylinder_geometry, cylinder_material);
    cylinder.rotation.z = Math.PI * 0.5;
    cylinder.position.z = 5;
    scene.add(cylinder);

    const plane_geometry = new THREE.PlaneGeometry(20, 20);
    const plane_material = new THREE.MeshBasicMaterial({ map: vesselTexture, color: redColor });
    const plane = new THREE.Mesh(plane_geometry, plane_material);
    plane.position.y = -5;
    plane.rotation.x = Math.PI * 0.5;
    scene.add(plane);

    /*const bouleGeometry = new THREE.IcosahedronGeometry(50, 50);
    const vesselMaterial = new THREE.ShaderMaterial({
        uniforms: { ...vesselUniforms, u_texture: { value: vesselTexture } },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
    });
    ground = new THREE.Mesh(bouleGeometry, vesselMaterial);
    ground.position.y = -53.5;
    ground.rotation.x = Math.PI * 0.5;
    scene.add(ground);```

    // Background
    const backgroundGeometry = new THREE.PlaneGeometry(window.innerWidth / 25, window.innerWidth / 25);
    background = new THREE.Mesh(backgroundGeometry, vesselMaterial);
    background.position.z = -10;
    scene.add(background);*/

    // GUI
    //const gui = new GUI();
    //gui.add(uniforms.u_frequency, 'value', 0, 20).name('Frequency');
    //gui.add(uniforms.u_red, 'value', 0, 1).name('Red');
    //gui.add(uniforms.u_green, 'value', 0, 1).name('Green');
    //gui.add(uniforms.u_blue, 'value', 0, 1).name('Blue');

    // Health Bar and Score
    const healthBarGeometry = new THREE.PlaneGeometry(2, 0.2);
    const healthBarMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    healthBar = new THREE.Mesh(healthBarGeometry, healthBarMaterial);
    healthBar.position.set(0, 4, 0);
    scene.add(healthBar);

    // Load font using fetch
    fetch('static/roboto.json')
        .then(response => response.json())
        .then(fontData => {
            const font = new Font(fontData);
            const textGeometry = new TextGeometry('Score: 0', {
                font: font,
                size: 0.5,
                height: 0.1,
            });
            scoreText = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
            scoreText.position.set(0, 3, 0);
            scene.add(scoreText);
        })
        .catch(error => {
            console.error('Error loading font:', error);
        });

    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
}

function spawnVirus() {
    const size = Math.random() * 0.5 + 0.3; // Random size between 0.3 and 0.8
    const virusGeometry = new THREE.IcosahedronGeometry(size, 5);

    // Random color, more likely to be green
    const color = new THREE.Color(Math.random() * 0.5, Math.random(), Math.random() * 0.5);
    const virusTexture = new THREE.DataTexture(new Uint8Array(
        [
            color.r * 25,
            color.g * 0,
            color.b * 255
        ]), 1, 1, THREE.RGBFormat);
    const virusMaterial = new THREE.ShaderMaterial({
        uniforms: { ...uniforms, u_texture: { value: virusTexture } },
        vertexShader: document.getElementById('vertexshader2').textContent,
        fragmentShader: document.getElementById('fragmentshader2').textContent,
    });

    const virus = new THREE.Mesh(virusGeometry, virusMaterial);
    virus.position.set(10, Math.random() * 8 - 4, 0);
    scene.add(virus);
    viruses.push(virus);
}

function spawnPowerUp() {
    const powerUpGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const powerUpMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const powerUp = new THREE.Mesh(powerUpGeometry, powerUpMaterial);
    powerUp.position.set(10, Math.random() * 8 - 4, 0);
    scene.add(powerUp);
    powerUps.push(powerUp);
}

function updateHealthBar() {
    healthBar.scale.x = health / 100 * 2;
    if (health <= 0) {
        alert('Game Over! Your score is ' + score);
        location.reload();
    }
}

function updateScore() {
    scoreText.geometry.dispose();
    scoreText.material.dispose();
    scene.remove(scoreText);

    const fontLoader = new FontLoader();
    fontLoader.load('static/roboto.json', (font) => {
        const textGeometry = new TextGeometry('Score: ' + score, {
            font: font,
            size: 0.5,
            height: 0.1,
        });
        scoreText = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
        scoreText.position.set(-9, 3, 0);
        scene.add(scoreText);
    });
}

function updateGameObjects() {
    // Move and check viruses
    viruses.forEach((virus, index) => {
        virus.position.x -= 0.1;
        if (virus.position.x < -30) {
            scene.remove(virus);
            viruses.splice(index, 1);
        }
        if (virus.position.distanceTo(whiteBloodCell.position) < 1) {
            scene.remove(virus);
            viruses.splice(index, 1);
            health -= 10;
            updateHealthBar();
        }
    });

    // Move and check power-ups
    powerUps.forEach((powerUp, index) => {
        powerUp.position.x -= 0.1;
        if (powerUp.position.x < -30) {
            scene.remove(powerUp);
            powerUps.splice(index, 1);
        }
        if (powerUp.position.distanceTo(whiteBloodCell.position) < 1) {
            scene.remove(powerUp);
            powerUps.splice(index, 1);
            score += 50;
            updateScore();
        }
    });

    // Randomly spawn viruses and power-ups
    if (Math.random() < 0.02) spawnVirus();
    if (Math.random() < 0.005) spawnPowerUp();
}

function animate() {
    requestAnimationFrame(animate);

    uniforms.u_time.value += 0.05;



    // Calculate the target position based on the mouse position
    targetY = mouseY * 5; // Adjust the multiplier to control the movement range

    // Apply damping to create an elastic effect
    whiteBloodCell.position.y += (targetY - whiteBloodCell.position.y) * dampingFactor;

    // Rotate the white blood cell
    whiteBloodCell.rotation.x += 0.01;
    whiteBloodCell.rotation.y += 0.01;

    /**ground.rotation.y += 0.003;

    // Move the background
    background.position.x -= 0.05;
    if (background.position.x < -window.innerWidth / 25) {
        background.position.x = 0;
    }**/

    updateGameObjects();

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize the scene
init();
animate();