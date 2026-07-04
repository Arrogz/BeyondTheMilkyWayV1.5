import * as THREE from "/build/three.module.js";
import {scene} from "./setup.js";
import {lerp} from "./setup.js";

let asteroid;
export const asteroids = [];

export function createAsteroidField(count = 100, bounds = new THREE.Vector3(200, 200, 200), offset =  new THREE.Vector3(200, 200, 200)) {
    const material = createAsteroidMaterial();

    const velocityRange = 5;

    for (let i = 0; i < count; i++) {
        const radius = randomRange(1, 20);
        asteroid = createAsteroid(material, radius);

        asteroid.position.set(
            (Math.random() - 0.5) * bounds.x + offset.x,
            (Math.random() - 0.5) * bounds.y + offset.y,
            (Math.random() - 0.5) * bounds.z + offset.z
        );

        asteroids.push({
            mesh: asteroid, // mesh of the asteroid
            radius: radius, // radius
            velocity: new THREE.Vector3(
                randomRange(-1 * velocityRange, velocityRange),
                randomRange(-1 * velocityRange, velocityRange),
                randomRange(-1 * velocityRange, velocityRange)
            ) // random starter velocity
        });
        scene.add(asteroid);
    }

}


// textureloader for asteroid material
function createAsteroidMaterial() {

    const textureLoader =
        new THREE.TextureLoader();

    const colorMap =
        textureLoader.load(
            "./image/asteroid/ground_0010_color_1k.jpg"
        );

    const normalMap =
        textureLoader.load(
            "./image/asteroid/ground_0010_normal_opengl_1k.png"
        );

    const roughnessMap =
        textureLoader.load(
            "./image/asteroid/ground_0010_roughness_1k.jpg"
        );

    const aoMap =
        textureLoader.load(
            "./image/asteroid/ground_0010_ao_1k.jpg"
        );

    const heightMap =
        textureLoader.load(
            "./image/asteroid/ground_0010_height_1k.png"
        );

    [colorMap, normalMap, roughnessMap].forEach(texture => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
    });

    return new THREE.MeshStandardMaterial({
        map: colorMap,

        normalMap: normalMap,

        roughnessMap: roughnessMap,

        aoMap: aoMap,

        bumpMap: heightMap,
        bumpScale: 0.05,

        roughness: 1,

        flatShading: false,

        transparent: true,

        opacity: 1,

    });

}

function createAsteroid(material, radius = 5, detail = 5) {

    const geometry =
        new THREE.IcosahedronGeometry(radius, detail);


    geometry.setAttribute(
        'uv2',
        new THREE.BufferAttribute(
            geometry.attributes.uv.array,
            2
        )
    );

    const position = geometry.attributes.position;

    const vertex = new THREE.Vector3();

    // unique seed for every asteroid
    const seed = {
        x:          Math.random() * 10,
        y:          Math.random() * 10,
        z:          Math.random() * 10,
        frequency:  5 + Math.random(), // how often bumps occur
        amplitude:  0.3 + Math.random() * 0.35 // how large bumps are
    }

    const scaleX = 0.8 + Math.random() * 0.8;
    const scaleY = 0.8 + Math.random() * 0.8;
    const scaleZ = 0.8 + Math.random() * 0.8;


    // iterating through all points in geometry
    for (let i = 0; i < position.count; i++) {

        vertex.set(
            position.getX(i),
            position.getY(i),
            position.getZ(i)
        );

        vertex.normalize();

        // creates wave like deformation
        const noise =
            Math.sin(vertex.x * seed.frequency + seed.x) *
            Math.sin(vertex.y * seed.frequency + seed.y) *
            Math.sin(vertex.z * seed.frequency + seed.z);

        //
        const displacement =
            radius + noise * seed.amplitude;

        vertex.multiplyScalar(displacement);

        // Make asteroid uneven
        vertex.x *= scaleX;
        vertex.y *= scaleY;
        vertex.z *= scaleZ;

        position.setXYZ(
            i,
            vertex.x,
            vertex.y,
            vertex.z
        );
    }

    geometry.attributes.position.needsUpdate = true;

    geometry.computeVertexNormals();

    return new THREE.Mesh(geometry, material);
}


// generate random number between two rangers
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}
export function hyperspaceAnimate(isHyperspace){
    //console.log(asteroids[1].mesh);
    for (let i = 0; i < asteroids.length; i++) {
        let asteroid = asteroids[i];
        //console.log(asteroid.mesh.material.opacity);
        if(isHyperspace) {
            asteroid.mesh.material.opacity = lerp(asteroid.mesh.material.opacity, 0, 0.001);
        }
        else {
            asteroid.mesh.material.opacity = lerp(asteroid.mesh.material.opacity, 1, 0.00005);
        }
    }
}