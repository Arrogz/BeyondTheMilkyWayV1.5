import { getBoostFuel, getMaxFuel, getOnCooldown } from './movement.js';

const fuelBarFill = document.getElementById('fuel-bar-fill');
const fuelLabel = document.getElementById('fuel-label');


export function updateHUD() {
    const fuel = getBoostFuel();
    const max = getMaxFuel();
    const onCooldown = getOnCooldown();
    const pct = (fuel / max) * 100;

    fuelBarFill.style.width = `${pct}%`;

    // change colour based on fuel level
    if (onCooldown) {
        fuelLabel.textContent = 'COOLING DOWN';
        fuelLabel.style.color = '#ff3333';
    } else {
        fuelLabel.textContent = 'BOOSTER';
        fuelLabel.style.color = '#00ffff';
    }

    if (pct > 50) {
        fuelBarFill.style.background = '#00ffff';
    } else if (pct > 25) {
        fuelBarFill.style.background = '#ffaa00';
    } else {
        fuelBarFill.style.background = '#ff3333';
    }

}