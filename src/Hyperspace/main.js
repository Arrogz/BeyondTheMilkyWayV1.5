import * as THREE from "/build/three.module.js";
import {scene, renderer, camera, setScene, setSceneLighting, setSceneElements, createShip} from "./setup.js";
import {updateSpaceship} from "./movement.js";
import {animateHyperspace} from "./hyperspace.js";
import {createAsteroidField, animateAsteroids} from "./asteroid.js";
//import {OrbitControls} from "/build/controls/OrbitControls.js";
import { OutlineEffect } from "/build/effects/OutlineEffect.js";
const clock = new THREE.Clock();
export let isHyperJump = false;

setScene();
setSceneLighting();

export const spaceship = await createShip();
const spaceshipDummy = await createShip();

setSceneElements();

createAsteroidField(1000, new THREE.Vector3(1000, 1000, 1000));

//const controls = new OrbitControls(camera, renderer.domElement);
const effect = new OutlineEffect(renderer, {
    defaultThickness: 0.005,
    defaultColor: [0, 0, 0],
    defaultAlpha: 1.0,
    defaultKeepAlive: true
});



const mouse = new THREE.Vector2();
const keys = {};
window.addEventListener("keydown", (e) => {keys[e.code] = true;});
window.addEventListener("keyup", (e) => {keys[e.code] = false;});
window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
function onKeyDown(event) {
    if(event.key== "f") {
        isHyperJump = !isHyperJump;
    }
}

function animate() {
    //controls.update()

    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    updateSpaceship(spaceship, deltaTime, keys, mouse);

    animateHyperspace(camera);

    animateAsteroids();

    renderer.render(scene, camera);
    //console.log(isHyperJump);

    //console.log(camera.rotation.x);
}

animate();
window.addEventListener('keydown', onKeyDown);

