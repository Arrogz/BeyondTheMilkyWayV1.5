import * as THREE from "./build/three.module.js";
import {scene} from "./setup.js";
import {OBJLoader} from "/build/loaders/OBJLoader.js";
import {initBooster} from "./rocketBooster.js";


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
    const spaceship = await loadOBJ("plane.obj");
    spaceship.material = new THREE.MeshStandardMaterial({
        map: new THREE.TextureLoader().load("image/texture/plane.jpg"),
        emissive: new THREE.Color(0, 0, 0),
        emissiveIntensity: 0,
        side: THREE.DoubleSide,

    });

    spaceship.material.userData.outlineParameters = {
        thickness: 0.5,
        color: [0, 1, 1],
        alpha: 1.0,
        visible: true,
        keepAlive: true
    };

    spaceship.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
    spaceship.scale.set(1, 1, -1);
    scene.add(spaceship);

    const blackoutGeometry = new THREE.SphereGeometry(650, 4, 4);
    const blackoutMaterial = new THREE.MeshToonMaterial ({
        color: new THREE.Color(0, 0, 0),
        wireframe: false,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: 0,
    })
    const blackoutSphere = new THREE.Mesh(blackoutGeometry, blackoutMaterial);
    scene.add(blackoutSphere);
    spaceship.add(blackoutSphere);

    initBooster(scene);
    createShipLights(spaceship);

    return spaceship;
}

function createShipLights(ship) {
    const leftLight = new THREE.SpotLight(0xffffff, 3, 150, Math.PI / 16);
    leftLight.position.set(-1.7, -0.2, -5);
    leftLight.target.position.set(-1.7, -0.2, 20);
    ship.add(leftLight);
    ship.add(leftLight.target);

    const rightLight = new THREE.SpotLight(0xffffff, 3, 150, Math.PI / 16);
    rightLight.position.set(1.7, 0.2, -5);
    rightLight.target.position.set(2, 0, 20);
    ship.add(rightLight);
    ship.add(rightLight.target);
}