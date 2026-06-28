import * as THREE from "/build/three.module.js";
// import {OBJLoader} from "/build/loaders/OBJLoader.js";
import {createShip} from "./ship.jsx";
import {createAsteroidField} from "./asteroid.jsx";
import {setupRaceUI} from "./raceGame.jsx";

export let scene;
export let camera;
export let renderer;

export let spaceship;

const clock = new THREE.Clock();

export function setScene() {
    scene = new THREE.Scene();
    const renderView = document.querySelector(".render-view");
    const aspectRatio = renderView.clientWidth / renderView.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 2000);

    camera.position.set(0, 10, 20);
    camera.lookAt(0,0,0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(renderView.clientWidth, renderView.clientHeight);
    renderer.domElement.style.borderRadius = "15px";



    const loader = new THREE.CubeTextureLoader();
    let skyTexture = loader.load([
        '/image/skybox/0/right.png', '/image/skybox/0/left.png',
        '/image/skybox/0/top.png',    '/image/skybox/0/bottom.png',
        '/image/skybox/0/front.png', '/image/skybox/0/back.png'
    ]);
    scene.background = skyTexture;
    document.querySelector(".render-view").appendChild(renderer.domElement);
}


export function setSceneLighting() {
    //I would say theres no much lighting because I experimented with them and I would prefer how its turning out the most
    const cameraLight = new THREE.PointLight( new THREE.Color(1,1,1), 0.5);
    camera.add(cameraLight);
    scene.add(camera);

    const sunLight = new THREE.DirectionalLight(new THREE.Color(1,1,1), 2);
    sunLight.position.set(-300,-30,-100);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight("#97e0e8",1);
    scene.add(ambientLight);
}


export function lerp(from, to, speed) {
    const amount = (1 - speed) * from + speed * to
    return Math.abs(from - to) < 0.001 ? to : amount
}

export let cube;
export let cubes = [];

export async function setSceneElements() {

    spaceship = await createShip();

    createAsteroidField(150, new THREE.Vector3(500, 500, 500), new THREE.Vector3(Math.random() * 2000, Math.random() * 2000, Math.random() * 2000));
    setupRaceUI();

    let cubeGeometry = new THREE.BoxGeometry(0.2,0.2,0.2);
    let cubeMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.7,0.7,1),
        wireframe: false,
        transparent: true,
        opacity: 0,
    });
    cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    for(let i = 0; i<500;i++) {

        cubes[i] = cube.clone();
        cubes[i].position.set(Math.random() * 100 - 50 , Math.random() * 100 - 50, Math.random() * -200 - 20);
        while(cubes[i].position.x < 5 && cubes[i].position.x > -5&& cubes[i].position.y < 5 && cubes[i].position.y > -5) {
            cubes[i].position.x = Math.random() * 100 - 50;
            cubes[i].position.y = Math.random() * 100 - 50;
        }

        scene.add(cubes[i]);
        camera.add(cubes[i]);
    }
}

function resizeRenderView() {
    const width = document.querySelector(".render-view").clientWidth;
    const height = document.querySelector(".render-view").clientHeight;
    renderer.setSize(width,height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    camera.pov = 35;
    renderer.render(scene,camera);
}
window.addEventListener("resize", resizeRenderView);
