import * as THREE from "/build/three.module.js";
import {camera, spaceship} from "./setup.js";
import {isHyperJump} from "./main.js";
import * as PARTICLE from "./rocketBooster.js";
import {shipBoostColor, updateBooster} from "./rocketBooster.js";

const shipSettings = {

    acceleration: 70,
    deceleration: 100,

    maxSpeed: 150,
    minSpeed: 0, // stationary

    boostSpeed: 250,
    fuelMax: 60,
    fuelDrainRate: 20, // amount of fuel lost per second
    refuelRate: 15, // amount of fuel gained per second
    cooldownDuration: 3.0,

    rotationSmoothness: 5,

    cameraDistance: 50,
    cameraHeight: 9,
    cameraSmoothness: 0.08,
};


let currentSpeed = 0;
export let isAlive = true;

export function updateSpaceship(spaceship, deltaTime, mouse) {
    if (!isAlive) return;

    updateShipRotation(spaceship, deltaTime, mouse);

    updateShipMovement(spaceship, deltaTime);

    updateThirdPersonCamera(spaceship, deltaTime);

    updateBooster(spaceship, deltaTime);
}

export function killSpaceship() {
    isAlive = false;
}

export function resetSpaceship() {
    isAlive = true;
    currentSpeed = 0;
    spaceship.position.set(0, 0, 0);
    spaceship.rotation.set(0, 0, 0);
}

let yawVelocity = 0;
let pitchVelocity = 0;
let verticalVelocitySensitive = -0.1;
let horizontalVelocitySensitive = 0.2;
let currentRoll = 0;
const shipEuler = new THREE.Euler(0, 0, 0, "YXZ");

const rotationSettings = {

    yawAcceleration: 1.0,
    pitchAcceleration: 1.0,

    yawDamping: 0.92,
    pitchDamping: 0.92,

    maxPitch: THREE.MathUtils.degToRad(85),

    rollAmount: THREE.MathUtils.degToRad(70),

};

function updateShipRotation(spaceship, deltaTime, mouse) {

    yawVelocity +=  - mouse.x * rotationSettings.yawAcceleration * deltaTime * horizontalVelocitySensitive;

    pitchVelocity += - mouse.y * rotationSettings.pitchAcceleration * deltaTime * verticalVelocitySensitive;

    yawVelocity *= rotationSettings.yawDamping;
    pitchVelocity *= rotationSettings.pitchDamping;

    shipEuler.y += yawVelocity;

    shipEuler.x += pitchVelocity;

    shipEuler.x = THREE.MathUtils.clamp(shipEuler.x, -rotationSettings.maxPitch, rotationSettings.maxPitch);


    const targetRoll = - mouse.x * rotationSettings.rollAmount;

    shipEuler.z = THREE.MathUtils.lerp(shipEuler.z, targetRoll, 5 * deltaTime);

    spaceship.quaternion.setFromEuler(shipEuler);

}

let boostFuel = shipSettings.fuelMax;
let isBoosting = false;
let onCooldown = false;
let cooldownTimer = 0;

export function getBoostFuel() { return boostFuel; }
export function getMaxFuel() { return shipSettings.fuelMax; }
export function getOnCooldown() { return onCooldown; }

export function decelerate(deltaTime) {
    currentSpeed -= shipSettings.deceleration * deltaTime;
    clampSpeed();
}

export function accelerate(deltaTime) {
    currentSpeed += shipSettings.acceleration * deltaTime;
    clampSpeed();
}

export function startBoost() {
    if (boostFuel > 0 && !onCooldown) {
        isBoosting = true;
        PARTICLE.shipBoostColor(true);
    }
}

export function stopBoost() {
    isBoosting = false;
    PARTICLE.shipBoostColor(false);
    clampSpeed();
}

// makes sure speed is between the min and max speed
function clampSpeed() {
    currentSpeed = THREE.MathUtils.clamp(currentSpeed, shipSettings.minSpeed, shipSettings.maxSpeed
    );
}

const forward = new THREE.Vector3(0, 0, -1);

function updateShipMovement(spaceship, deltaTime) {

    if (onCooldown) {
        cooldownTimer -= deltaTime;
        if (cooldownTimer <= 0) {
            onCooldown = false;
        }
    }

    if (isBoosting && boostFuel > 0 && !onCooldown) {
        currentSpeed = shipSettings.boostSpeed;
        boostFuel -= shipSettings.fuelDrainRate * deltaTime;
        if (boostFuel <= 0) {
            boostFuel = 0;
            isBoosting = false;
            onCooldown = true;
            cooldownTimer = shipSettings.cooldownDuration;
            PARTICLE.stopBoost();
        }
    } else {
        // refuels by amount if it isn't already the max and isn't currently on cooldown
        if (!onCooldown) {
            boostFuel = Math.min(boostFuel + shipSettings.refuelRate * deltaTime, shipSettings.fuelMax);
        }
    }

    forward.set(0, 0, -1).applyQuaternion(spaceship.quaternion);

    spaceship.position.add(forward.multiplyScalar(currentSpeed * deltaTime));

}

const desiredCameraPosition = new THREE.Vector3();

function updateThirdPersonCamera(spaceship, deltaTime) {

    const cameraOffset = new THREE.Vector3(0, shipSettings.cameraHeight, shipSettings.cameraDistance);

    cameraOffset.applyQuaternion(spaceship.quaternion);

    desiredCameraPosition.copy(spaceship.position).add(cameraOffset);

    camera.position.lerp(desiredCameraPosition, shipSettings.cameraSmoothness);

    const lookDirection = new THREE.Vector3(0, 0, -1);

    lookDirection.applyQuaternion(spaceship.quaternion);

    const lookTarget = spaceship.position.clone().add(lookDirection.multiplyScalar(50));

    camera.lookAt(lookTarget);
}