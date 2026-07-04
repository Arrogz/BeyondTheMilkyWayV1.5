import * as THREE from "/build/three.module.js";
import {OBJLoader} from "/build/loaders/OBJLoader.js";
export let scene;
export let camera;
export let renderer;
export function setScene() {
    scene = new THREE.Scene();
    const renderView = document.querySelector(".render-view");
    const aspectRatio = renderView.clientWidth / renderView.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);

    camera.position.set(0, 10, 20);
    camera.lookAt(0,0,0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(renderView.clientWidth, renderView.clientHeight);
    renderer.domElement.style.borderRadius = "15px";



    const loader = new THREE.CubeTextureLoader();
    //creating the galaxy background
    const skyTexture = loader.load([
        '/image/skybox/right.png', '/image/skybox/left.png',
        '/image/skybox/top.png',    '/image/skybox/bottom.png',
        '/image/skybox/front.png', '/image/skybox/back.png'
    ]);
    scene.background = skyTexture;
    document.querySelector(".render-view").appendChild(renderer.domElement);
}

export function setSceneLighting() {
    //I would say theres no much lighting because I experimented with them and I would prefer how its turning out the most
    const cameraLight = new THREE.PointLight( new THREE.Color(1,1,1), 0.5);
    camera.add(cameraLight);
    scene.add(camera);

    const ambientLight = new THREE.AmbientLight(new THREE.Color(0.5,1,1),0.2);
    scene.add(ambientLight);
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
//window.addEventListener("resize", resizeRenderView);

export function lerp(from, to, speed) {
    const amount = (1 - speed) * from + speed * to
    return Math.abs(from - to) < 0.001 ? to : amount
}

export let cube;
export let cubes = [];

export function setSceneElements() {
    const floorGeometry = new THREE.BoxGeometry(3, 0.1, 5, 1, 1, 1);
    const floorMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0.2,1,0.2),
        wireframe: true
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -1;
    scene.add(floor);

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




async function loadOBJ(modelName) {
    const loader = new OBJLoader();
    let mesh;
    const group = await loader.loadAsync(`models/${modelName}`);
    group.traverse((child) => {
        if (child.isMesh) {
            mesh = child;
        }
    })
    return mesh;
}

export async function createShip() {
    const ship = await loadOBJ("plane.obj");
    ship.material = new THREE.MeshToonMaterial({
        map: new THREE.TextureLoader().load("image/texture/plane.jpg"),
        emissive: new THREE.Color(0.5, 1, 1),
        emissiveIntensity: 0.25,
        side: THREE.DoubleSide
    });

    ship.material.userData.outlineParameters = {
        thickness: 0.005,
        color: [0, 1, 1],
        alpha: 1.0,
        visible: true,
        keepAlive: true
    };

    ship.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10);
    ship.scale.set(1, 1, -1);
    scene.add(ship);
    return ship;
}

