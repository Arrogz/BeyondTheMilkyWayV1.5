import * as THREE from './build/three.module.js';

const PARTICLE_COUNT = 100;
const particles = [];
const nColor  = new THREE.Color(1, 0.5, 0);
const bColor = new THREE.Color(0, 0.5, 1);
let cColor = nColor;
let boosterLight = new THREE.PointLight(nColor, 300, 0);
let geometry, material, points;

export function initBooster(scene) {
    geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    material = new THREE.PointsMaterial({
        color: new THREE.Color(1, 0.5, 0),
        size: 0.7,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    boosterLight.position.set(0, 0, 0);
    //scene.add(boosterLight);


    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            position: new THREE.Vector3(),
            velocity: new THREE.Vector3(),
            life: Math.random(), // 0 to 1
            maxLife: 0.05 + Math.random() * 0.05
        });
    }
}


export function shipBoostColor(isBoost) {
    cColor = (isBoost) ? bColor : nColor;
    material.needsUpdate = true;
}



export function updateBooster(spaceship, deltaTime) {
    const positions = geometry.attributes.position.array;

    material.color.lerp(cColor, 0.03);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = particles[i];
        particle.life -= deltaTime;


        if (particle.life <= 0) {
            // spawns inside of the area of the booster
            const offsetX = (Math.random() - 0.5) * 1.4;
            const offsetY = -0.525 + (Math.random() - 0.5) * 0.55;

            const offset = new THREE.Vector3(offsetX, offsetY, 9);
            offset.applyQuaternion(spaceship.quaternion);
            particle.position.copy(spaceship.position).add(offset);

            // how far from centre (0 = centre, 1 = edge)
            const distFromCentre = Math.sqrt(
                (offsetX / 0.7) ** 2 +          // normalise by half-width
                ((offsetY + 0.525) / 0.275) ** 2 // normalise by half-height
            );

            // centre = long life, edge = short life
            particle.maxLife = (0.08 - distFromCentre * 0.05) + Math.random() * 0.06;
            particle.maxLife = Math.max(particle.maxLife, 0.01); // minimum life

            const vel = new THREE.Vector3(0, 0, (15 + Math.random() * 8));
            vel.applyQuaternion(spaceship.quaternion);
            particle.velocity.copy(vel);

            particle.life = particle.maxLife;
        }


        particle.position.addScaledVector(particle.velocity, deltaTime);

        positions[i * 3]     = particle.position.x;
        positions[i * 3 + 1] = particle.position.y;
        positions[i * 3 + 2] = particle.position.z;
    }

    geometry.attributes.position.needsUpdate = true;

}