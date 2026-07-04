import {asteroids} from "./asteroid.js";

const shipRadius = 3;

export function checkForCollisions(spaceship, onCollision) {
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        const distance = spaceship.position.distanceTo(asteroid.mesh.position);

        const minDistance = asteroid.radius + shipRadius;

        if (distance < minDistance) {
            onCollision(asteroid);
            asteroid.mesh.userData.hitCooldown = true;
            setTimeout(() => asteroid.mesh.userData.hitCooldown = false, 1000);
        }
    }
}