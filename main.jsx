import * as THREE from "/build/three.module.js";
import {scene, renderer, camera, spaceship, setScene, setSceneLighting, setSceneElements} from "./setup.jsx";
import {updateSpaceship, killSpaceship, resetSpaceship} from "./movement.jsx";
import {animateHyperspace} from "./hyperspace.jsx";
import {updateControls} from "./controls.jsx";
import {updateChunks} from "./galaxy.jsx";
//import {OrbitControls} from "/build/controls/OrbitControls.js";
import { OutlineEffect } from "/build/effects/OutlineEffect.js";
import {updateHUD} from "./boosterHud.jsx";
import {hyperspaceAnimate} from "./asteroid.jsx";
import {startRace, updateRace} from "./raceGame.jsx";
import {checkForCollisions} from "./collision.jsx";
import { setupMenus, showMenu, hideMenu, isMenuOpen, setupMenuButtons } from './menu.jsx';


const clock = new THREE.Clock();
export let isHyperJump = false;

setScene();
setSceneLighting();
await setSceneElements();

setupMenus();
setupMenuButtons({
    onResume: () => {
        togglePause();
    },
    onStart: () => {
        togglePause();
        startRace();
    },
    onRetry: () => {
        hideMenu('retry');
        resetSpaceship();
    }
});


//const controls = new OrbitControls(camera, renderer.domElement);
const effect = new OutlineEffect(renderer, {
    defaultThickness: 0.005,
    defaultColor: [0, 0, 0],
    defaultAlpha: 1.0,
    defaultKeepAlive: true
});

let animationId = null;
let isPaused = false;


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
    if (event.key === "Escape") {
        togglePause();
    }
}


function togglePause() {
    if (isMenuOpen('retry')) return;
    isPaused = !isPaused;


    if (isPaused) {
        showMenu('pause');
        cancelAnimationFrame(animationId);
    }
    else {
        hideMenu('pause');
        clock.getDelta(); // resets clocks last time called to current time.
        animate()
    }
}



export function animate() {
    //controls.update()
    if (isPaused) return;

    animationId = requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();

    updateHUD();

    updateControls(deltaTime, keys);

    updateSpaceship(spaceship, deltaTime, mouse);

    checkForCollisions(spaceship, () => {
        killSpaceship();
        showMenu('retry');
    });

    animateHyperspace(camera, spaceship);

    updateChunks(spaceship, scene);

    hyperspaceAnimate(isHyperJump);

    updateRace(spaceship, deltaTime);

    renderer.render(scene, camera);
    //console.log(isHyperJump);

    //console.log(camera.rotation.x);
}


animate();
window.addEventListener('keydown', onKeyDown);

