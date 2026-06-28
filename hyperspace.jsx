import * as THREE from '/build/three.module.js';
import {lerp} from "./setup.jsx"
import {isHyperJump} from "./main.jsx";
import {cube, cubes, scene} from "./setup.jsx";
const loader = new THREE.CubeTextureLoader();

let cubeX = 0.1, cubeY = 0.1, cubeZ = 0.1;
let cubeSize = {
    minX: 0.2,
    minY: 0.2,
    minZ: 0.2,
    maxX: 3,
    maxY: 3,
    maxZ: 150,
}

let cubeSpeed = {
    minSpeed: 0.01,
    maxSpeed: 3,
}

let phase = 0;
let speed = 0.01;
let worldId = 0;
export function animateHyperspace(camera, spaceship){
    if(!isHyperJump) phase = 0;
    else if(phase == 0) phase = 1;

    //console.log(camera.fov);

    switch(phase){
        case 1:
            cube.material.opacity = lerp(cube.material.opacity, 1,0.01);
            spaceship.children[0].material.opacity = lerp(spaceship.children[0].material.opacity, 1,0.01);
            if( spaceship.children[0].material.opacity > 0.7) spaceship.children[0].material.transparent = false;
            if(cube.material.opacity < 0.9)
                for(let i = 0;i < cubes.length; i++){
                    cubes[i].position.z+=speed;
                }

            if(cube.material.opacity > 0.9) {
                cubeX = lerp(cubeX, cubeSize.maxX-2, 0.001);
                cubeY = lerp(cubeY, cubeSize.maxY-2, 0.001);
                cubeZ = lerp(cubeZ, cubeSize.maxZ/2, 0.01);
                speed = lerp(speed, cubeSpeed.maxSpeed/25, 0.1);

                for(let i = 0;i < cubes.length; i++){
                    cubes[i].position.z+=speed;
                    cubes[i].scale.set(cubeX,cubeY,cubeZ);
                }
                if (camera.fov < 60) {
                    camera.fov = lerp(camera.fov, 60, 0.008);
                    camera.updateProjectionMatrix();
                }
                if (camera.fov > 58.5) {
                    phase = 2;
                }

            }
            break;
        case 2:
            cubeX = lerp(cubeX, cubeSize.maxX, 0.01);
            cubeY = lerp(cubeY, cubeSize.maxY, 0.01);
            cubeZ = lerp(cubeZ, cubeSize.maxZ, 0.01);
            speed = lerp(speed, cubeSpeed.maxSpeed, 0.05);

            worldId = Math.floor(Math.random() * 6);
            let skyTexture = loader.load([
                `/image/skybox/${worldId}/right.png`, `/image/skybox/${worldId}/left.png`,
                `/image/skybox/${worldId}/top.png`,    `/image/skybox/${worldId}/bottom.png`,
                `/image/skybox/${worldId}/front.png`, `/image/skybox/${worldId}/back.png`
            ]);
            scene.background = skyTexture;

            console.log(worldId);
            for(let i = 0;i < cubes.length; i++){
                cubes[i].scale.set(cubeX,cubeY,cubeZ);
                cubes[i].position.z+=speed;
                if(cubes[i].position.z > cubeZ) cubes[i].position.z = -cubes[i].position.z*(Math.random()*2);
            }

            if (camera.fov < 120) {
                camera.fov = lerp(camera.fov, 120, 0.08);
                camera.updateProjectionMatrix();
            }
            break;


        case 0:
            cubeX = lerp(cubeX, cubeSize.minX, 0.01);
            cubeY = lerp(cubeY, cubeSize.minY, 0.01);
            cubeZ = lerp(cubeZ, cubeSize.minZ, 0.01);
            speed = lerp(speed, cubeSpeed.minSpeed, 0.02);

            for(let i = 0;i < cubes.length; i++){
                cubes[i].scale.set(cubeX,cubeY,cubeZ);
                cubes[i].position.z+=speed;
                if(cubes[i].position.z > cubeSize.maxZ/8) cubes[i].position.z = -cubeSize.maxZ*((Math.random()+0.5));
            }

            if(cube.material.opacity < 0.05) {
                if (camera.fov > 35) {
                    camera.fov = lerp(camera.fov, 35, 0.07);
                }
            }
            camera.fov = lerp(camera.fov, 35, 0.0005);
            camera.updateProjectionMatrix();
            cube.material.opacity = lerp(cube.material.opacity, 0,0.007);
            spaceship.children[0].material.opacity = lerp(spaceship.children[0].material.opacity, 0,0.01);
            spaceship.children[0].material.transparent = true;
            break;
    }
}
export {cubeSize};
export {cubeSpeed};