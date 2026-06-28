const menus = {};

export function setupMenus() {
    menus.pause = document.getElementById('pause-menu');
    menus.retry = document.getElementById('retry-menu');
}

export function showMenu(menuName) {
    menus[menuName].style.display = 'flex';
}

export function hideMenu(menuName) {
    menus[menuName].style.display = 'none';
}

export function isMenuOpen(menuName) {
    return menus[menuName].style.display === 'flex';
}

export function setupMenuButtons({ onResume, onStart, onRetry }) {
    document.getElementById('resume-button').addEventListener('click', onResume);
    document.getElementById('start-button').addEventListener('click', onStart);
    document.getElementById('retry-button').addEventListener('click', onRetry);
}