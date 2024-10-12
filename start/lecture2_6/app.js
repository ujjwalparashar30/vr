import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { VRButton } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/webxr/VRButton.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

// Materials
const redMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const blueMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const greenMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

// Create test tubes
const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 32);
const testTube1 = new THREE.Mesh(geometry, redMaterial);
const testTube2 = new THREE.Mesh(geometry, blueMaterial);

testTube1.position.set(-0.5, 1.2, -1);
testTube2.position.set(0.5, 1.2, -1);

scene.add(testTube1);
scene.add(testTube2);

// Variables to track mixing
let isMixing = false;
let mixed = false;

// Gamepad input handling
function handleGamepadInput() {
    const gamepads = navigator.getGamepads();
    if (gamepads[0]) {
        const gp = gamepads[0];

        // 'A' button to start mixing
        if (gp.buttons[0].pressed && !isMixing) {
            console.log('Mixing chemicals...');
            startMixing();
        }

        // 'B' button to reset
        if (gp.buttons[1].pressed && mixed) {
            console.log('Resetting...');
            resetMix();
        }
    }

    requestAnimationFrame(handleGamepadInput);
}

// Start mixing function
function startMixing() {
    isMixing = true;
    setTimeout(() => {
        // Change the color to green after mixing
        testTube1.material = greenMaterial;
        testTube2.material = greenMaterial;
        mixed = true;
        isMixing = false;
        console.log('Chemicals mixed: Red + Blue = Green');
    }, 2000); // 2-second delay to simulate mixing process
}

// Reset the test tubes
function resetMix() {
    testTube1.material = redMaterial;
    testTube2.material = blueMaterial;
    mixed = false;
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate function
function animate() {
    renderer.setAnimationLoop(() => {
        renderer.render(scene, camera);
    });
}

// Start checking for gamepad input
handleGamepadInput();

// Start animation
animate();
