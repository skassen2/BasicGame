// Import Three.js and necessary modules
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the room (walls, floor, and ceiling)
const roomGeometry = new THREE.BoxGeometry(20, 20, 20);
const roomMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.BackSide });
const room = new THREE.Mesh(roomGeometry, roomMaterial);
scene.add(room);

// Create an array to store the shapes
let shapes = [];

// Function to create random shapes
function createRandomShape() {
    const shapeType = Math.floor(Math.random() * 4);
    let geometry;

    switch (shapeType) {
        case 0:
            geometry = new THREE.SphereGeometry(Math.random() * 2, 32, 32);
            break;
        case 1:
            geometry = new THREE.BoxGeometry(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            break;
        case 2:
            geometry = new THREE.ConeGeometry(Math.random() * 1, Math.random() * 3, 32);
            break;
        case 3:
            geometry = new THREE.CylinderGeometry(Math.random() * 1, Math.random() * 1, Math.random() * 3, 32);
            break;
    }

    const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const shape = new THREE.Mesh(geometry, material);
    shape.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18
    );
    return shape;
}

// Add random shapes to the room
for (let i = 0; i < 20; i++) {
    const shape = createRandomShape();
    scene.add(shape);
    shapes.push(shape);
}

// Add lighting to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 10, 10);
scene.add(pointLight);

// Set up controls
const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => {
    controls.lock();
});

const moveSpeed = 0.1;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

document.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'KeyW':
            moveForward = true;
            break;
        case 'KeyS':
            moveBackward = true;
            break;
        case 'KeyA':
            moveLeft = true;
            break;
        case 'KeyD':
            moveRight = true;
            break;
    }
});

document.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'KeyW':
            moveForward = false;
            break;
        case 'KeyS':
            moveBackward = false;
            break;
        case 'KeyA':
            moveLeft = false;
            break;
        case 'KeyD':
            moveRight = false;
            break;
    }
});

// Set initial camera position
camera.position.set(0, 1.6, 10);

// Raycaster for detecting clicks on shapes
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Counter for clicked shapes
let clickCounter = 0;

// Create a div to display the counter
const counterDisplay = document.createElement('div');
counterDisplay.style.position = 'absolute';
counterDisplay.style.top = '10px';
counterDisplay.style.left = '10px';
counterDisplay.style.color = 'white';
counterDisplay.style.fontSize = '24px';
document.body.appendChild(counterDisplay);

// Create a div for the crosshair
const crosshair = document.createElement('div');
crosshair.style.position = 'absolute';
crosshair.style.top = '50%';
crosshair.style.left = '50%';
crosshair.style.transform = 'translate(-50%, -50%)';
crosshair.style.width = '20px';
crosshair.style.height = '20px';
crosshair.style.border = '2px solid white';
crosshair.style.borderRadius = '50%';
document.body.appendChild(crosshair);

// Function to update the counter display
function updateCounter() {
    counterDisplay.textContent = `Shapes Clicked: ${clickCounter}`;
}

// Initialize the counter display
updateCounter();

// Event listener for mouse clicks
document.addEventListener('mousedown', (event) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(shapes);

    if (intersects.length > 0) {
        clickCounter++;
        updateCounter();
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update camera movement based on controls
    if (moveForward) controls.moveForward(moveSpeed);
    if (moveBackward) controls.moveForward(-moveSpeed);
    if (moveLeft) controls.moveRight(-moveSpeed);
    if (moveRight) controls.moveRight(moveSpeed);

    // Raycast to find if the crosshair is over any shape
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);  // Center of the screen
    const intersects = raycaster.intersectObjects(shapes);

    if (intersects.length > 0) {
        crosshair.style.borderColor = 'red';
    } else {
        crosshair.style.borderColor = 'white';
    }

    renderer.render(scene, camera);
}

animate();
