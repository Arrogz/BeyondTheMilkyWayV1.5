import * as THREE from "./build/three.module.js";
import {lerp} from "./setup.js";
import {isHyperJump} from "./src/main.jsx";
const CHUNK_SIZE = 1000;
const chunks = new Map();
export function getChunkCoord(position) {

    return {
        x: Math.floor(position.x / CHUNK_SIZE),
        y: Math.floor(position.y / CHUNK_SIZE),
        z: Math.floor(position.z / CHUNK_SIZE)
    };
}

function generateChunk(cx, cy, cz, scene) {

    const starCount = 500;

    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const insideColor = new THREE.Color(0xffccff);
    const outsideColor = new THREE.Color(0x3366ff);
    const radius = Math.random() * 100;

    for (let i = 0; i < starCount; i++) {

        const i3 = i * 3;

        positions[i3] =
            cx * CHUNK_SIZE +
            Math.random() * CHUNK_SIZE;

        positions[i3 + 1] =
            cy * CHUNK_SIZE +
            Math.random() * CHUNK_SIZE;

        positions[i3 + 2] =
            cz * CHUNK_SIZE +
            Math.random() * CHUNK_SIZE;

        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor, radius / 100);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colors, 3)
    );

    const material = new THREE.PointsMaterial({
        size:2,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        transparent: true,
    });

    const stars = new THREE.Points(geometry, material);

    scene.add(stars);

    return stars;
}

const RENDER_DISTANCE = 2;

export function updateChunks(ship, scene) {

    const current = getChunkCoord(ship.position);

    const neededChunks = new Set();

    for (let x = -RENDER_DISTANCE; x <= RENDER_DISTANCE; x++) {
        for (let y = -RENDER_DISTANCE; y <= RENDER_DISTANCE; y++) {
            for (let z = -RENDER_DISTANCE; z <= RENDER_DISTANCE; z++) {

                const cx = current.x + x;
                const cy = current.y + y;
                const cz = current.z + z;

                const key = `${cx},${cy},${cz}`;

                neededChunks.add(key);

                if (!chunks.has(key)) {

                    const stars = generateChunk(cx, cy, cz, scene);
                    chunks.set(key, stars);
                }
            }
        }
    }

    for (const [key, stars] of chunks.entries()) {
        if(isHyperJump) {
            if(stars.material.opacity > 0.01) {
                stars.material.opacity = lerp(stars.material.opacity, 0, 0.05);
            }
        }
        else {
            if(stars.material.opacity < 1) {
                stars.material.opacity = lerp(stars.material.opacity, 1, 0.005);
            }
        }
        if (!neededChunks.has(key)) {

            scene.remove(stars);

            stars.geometry.dispose();
            stars.material.dispose();

            chunks.delete(key);
        }
    }
}
