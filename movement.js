import * as THREE from "/build/three.module.js";
import {camera} from "./setup.js";
import {isHyperJump} from "./main.js";
const shipSettings = {

    acceleration: 70,
    deceleration: 100,

    maxSpeed: 150,
    minSpeed: 0,

    rotationSmoothness: 5,

    cameraDistance: 30,
    cameraHeight: 8,
    cameraSmoothness: 0.08,
};

let currentSpeed = 0;

export function updateSpaceship(spaceship, deltaTime, keys, mouse) {

    updateShipRotation(spaceship, deltaTime, mouse);

    updateThrottle(deltaTime, keys);

    updateShipMovement(spaceship, deltaTime);

    updateThirdPersonCamera(spaceship, deltaTime);

}

let yawVelocity = 0;
let pitchVelocity = 0;
let verticalVelocitySensitive = -0.1;
let horizontalVelocitySensitive = 0.2;
let currentRoll = 0;
const shipEuler = new THREE.Euler(0, 0, 0, "YXZ");

const rotationSettings = {

    yawAcceleration: 1.5,
    pitchAcceleration: 1.0,

    yawDamping: 0.92,
    pitchDamping: 0.92,

    maxPitch: THREE.MathUtils.degToRad(90),

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

    currentRoll = THREE.MathUtils.lerp(currentRoll, targetRoll, 5 * deltaTime
    );

    shipEuler.z = currentRoll;

    spaceship.quaternion.setFromEuler(shipEuler);

}

function updateThrottle(deltaTime, keys) {

    if (keys["KeyW"] && !isHyperJump) currentSpeed += shipSettings.acceleration * deltaTime;


    if (keys["KeyS"]) currentSpeed -= shipSettings.deceleration * deltaTime;

    if (isHyperJump) currentSpeed -= shipSettings.deceleration * 2 * deltaTime;
    console.log(currentSpeed);
    currentSpeed = THREE.MathUtils.clamp(
        currentSpeed,
        shipSettings.minSpeed,
        shipSettings.maxSpeed
    );

}

function updateShipMovement(spaceship, deltaTime) {
    const forward = new THREE.Vector3(0, 0, -1);

    forward.applyQuaternion(
        spaceship.quaternion
    );

    spaceship.position.add(
        forward.multiplyScalar(currentSpeed * deltaTime)
    );

}

const desiredCameraPosition = new THREE.Vector3();

function updateThirdPersonCamera(spaceship) {

    const cameraOffset = new THREE.Vector3(0, shipSettings.cameraHeight, shipSettings.cameraDistance);

    cameraOffset.applyQuaternion(spaceship.quaternion);

    desiredCameraPosition.copy(spaceship.position).add(cameraOffset);

    camera.position.lerp(desiredCameraPosition, shipSettings.cameraSmoothness);

    const lookDirection = new THREE.Vector3(0, 0, -1);

    lookDirection.applyQuaternion(spaceship.quaternion);

    const lookTarget = spaceship.position.clone().add(lookDirection.multiplyScalar(50));

    camera.lookAt(lookTarget);
}