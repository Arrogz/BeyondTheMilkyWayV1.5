import * as THREE from './build/three.module.js';
import * as MOVEMENT from './movement.js';
import {isHyperJump} from "./main.js";

const keybinds = Object.freeze({
    BRAKE : 'KeyS',
    MOVING : 'KeyW',
    BOOST : 'ShiftLeft'
})

let wasBoostHeld = false;

export function updateControls(deltaTime, keys) {

    const boostHeld = keys[keybinds.BOOST] && keys[keybinds.MOVING];
    
    if(!isHyperJump) {
        if (keys[keybinds.BRAKE]) {
            MOVEMENT.decelerate(deltaTime)
        }
        if (keys[keybinds.MOVING]) {
            MOVEMENT.accelerate(deltaTime)
        }


        if (boostHeld && !wasBoostHeld) MOVEMENT.startBoost();
    }
    else MOVEMENT.decelerate(deltaTime);
    if (!boostHeld && wasBoostHeld) MOVEMENT.stopBoost();

    wasBoostHeld = boostHeld;
}