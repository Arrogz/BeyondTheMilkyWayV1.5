import * as THREE from '/build/three.module.js';
import {lerp} from "./setup.js"
import {isHyperJump, spaceship} from "./main.js";
import {cube, cubes} from "./setup.js";

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

export function animateHyperspace(camera){
    if(!isHyperJump) phase = 0;
    else if(phase == 0) phase = 1;

    switch(phase){
        case 1:
            cube.material.opacity = lerp(cube.material.opacity, 1,0.01);
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
            break;
    }
}
export {cubeSize};
export {cubeSpeed};