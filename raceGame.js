import * as THREE from './build/three.module.js';
import {scene, camera} from "./setup.js";

let isPlaying = false;

const rings = [];
const ringGeometry = new THREE.TorusGeometry(
    20,
    0.6,
    16,
    100
)
const ringMaterial = new THREE.MeshStandardMaterial({
    color: 0xeaf04a,
});

let indicatorElement;
let timerElement;
let timeRemaining = 0;
const bestTimeElement = document.getElementById('best-time');
let bestTime = null;

let currentRingIndex = 0;


export function setupRaceUI() {
    setupRaceTimer();
    setupRingIndicator();
}

function setupRings(amtOfRings = 10, spacing = 1000) {
    for (let i = 0; i < amtOfRings; i++) {
        let ring = new THREE.Mesh(ringGeometry, ringMaterial.clone());
        ring.position.set(
            (Math.random() - 0.5) * spacing,
            (Math.random() - 0.5) * spacing,
            (Math.random() - 0.5) * spacing
        )
        ring.visible = false;
        scene.add(ring);
        rings.push(ring);
    }

    rings[amtOfRings-1].material.color.set(0xff0000);

}

function setupRaceTimer() {
    timerElement = document.createElement('div');
    timerElement.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        font-size: 32px;
        font-family: monospace;
        pointer-events: none;
        display: none;
    `;
    document.body.appendChild(timerElement);
}

function setupRingIndicator() {
    indicatorElement = document.createElement('div');
    indicatorElement.style.cssText = `
        position: fixed;
        width: 30px;
        height: 30px;
        background: #eaf04a;
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%); // triangle/arrow shape
        pointer-events: none;
        display: none;
    `;
    document.body.appendChild(indicatorElement);
}

export function updateRace(ship, deltaTime) {
    if (!isPlaying) return;

    const ring = rings[currentRingIndex];
    if (!ring) {
        finishRace();
        return;
    }

    updateRingIndicator(ring);
    updateTimer(deltaTime);

    const localPos = ring.worldToLocal(ship.position.clone());
    const distFromCenter = Math.sqrt(localPos.x ** 2 + localPos.y ** 2);


    if (distFromCenter < ring.geometry.parameters.radius &&  Math.abs(localPos.z) < 0.5) {
        nextRing(ring);
    }
}


// off-screen indicator for where the current ring is
function updateRingIndicator(ring) {
    // get the rings position in the screen space
    const ringPos = ring.position.clone().project(camera);

    const windowHeight = window.innerHeight/2;
    const windowWidth = window.innerWidth/2;

    // screen coordinates of the ring
    let screenX = ringPos.x * windowWidth + windowWidth;
    let screenY = -ringPos.y * windowHeight + windowHeight;


    // if the ring is behind the camera, flip the screen coordinates
    if (ringPos.z > 1) {
        screenX = window.innerWidth - screenX;
        screenY = window.innerHeight - screenY;
    }

    // check that the ring is on screen according to NDC coordinates
    const onScreen = ringPos.x > -1 && ringPos.x < 1 && ringPos.y > -1 && ringPos.y < 1 && ringPos.z < 1;

    if (onScreen) {
        indicatorElement.style.display = 'none';
        return;
    }

    indicatorElement.style.display = 'block';

    // so the indicator doesn't go off-screen
    const padding = 40;

    // direction from the screen center to the ring
    const dx = screenX - windowWidth;
    const dy = screenY - windowHeight;

    // scale so the longest axis hits the edge of the screen
    const scaleX = (windowWidth - padding) / Math.abs(dx);
    const scaleY = (windowHeight - padding) / Math.abs(dy);
    const scale = Math.min(scaleX, scaleY);

    // clamp the position to the screen edge
    const clampedX = windowWidth + dx * scale;
    const clampedY = windowHeight + dy * scale;

    const angle = Math.atan2(screenY - window.innerHeight / 2, screenX - window.innerWidth / 2);
    const degrees = angle * (180 / Math.PI) + 90;

    indicatorElement.style.left = `${clampedX}px`;
    indicatorElement.style.top = `${clampedY}px`;
    indicatorElement.style.transform = `translate(-50%, -50%) rotate(${degrees}deg)`;

}

function updateTimer(deltaTime) {
    timeRemaining -= deltaTime;
    timerElement.textContent = timeRemaining.toFixed(2) + 's';

    if (timeRemaining <= 0) {
        timeRemaining = 0;
        timeOutRace();
    }
}

function nextRing(ring) {
    ring.visible = false;
    currentRingIndex++;
    if (rings[currentRingIndex]) {
        rings[currentRingIndex].visible = true;
    }
}

export function startRace() {
    clearRings();
    setupRings(5);

    isPlaying = true;
    currentRingIndex = 0; // just in case
    rings[currentRingIndex].visible = true;
    timeRemaining = rings.length * 10;
    timerElement.style.display = 'block';
    indicatorElement.style.display = 'block';
}

function timeOutRace() {
    timerElement.textContent = 'Time\'s up!';
    rings[currentRingIndex].visible = false;
    finishRace();
}

function finishRace() {
    timerElement.style.display = 'none';
    indicatorElement.style.display = 'none';

    isPlaying = false;
    if (bestTime === null || timeRemaining > bestTime) {
        bestTime = timeRemaining;
        bestTimeElement.textContent = `BEST: ${bestTime.toFixed(2)}s`;
    }
}

function clearRings() {
    rings.forEach(ring => scene.remove(ring));
    rings.length = 0; // clears the array in place
}