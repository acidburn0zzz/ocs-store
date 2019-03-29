const {ipcRenderer} = require('electron');

function applySmoothScroll() {
    let timeoutId = null;
    let deltaX = 0;
    let deltaY = 0;
    const amount = 2;

    document.scrollingElement.addEventListener('wheel', (event) => {
        event.preventDefault();

        deltaX += event.deltaX * amount;
        deltaY += event.deltaY * amount;

        if (timeoutId === null) {
            timeoutId = setTimeout(() => {
                document.scrollingElement.scrollBy({
                    left: deltaX,
                    top: deltaY,
                    behavior: 'smooth'
                });
                timeoutId = null;
                deltaX = 0;
                deltaY = 0;
            }, 150);
        }
    });
}

/*
function detectUserProfile() {
    const profileMenu = document.querySelector('[rel="profile-menu"]');
    if (profileMenu) {
        const userName = profileMenu.querySelector('span').innerHTML;
        const userImage = profileMenu.querySelector('img').src;
        ipcRenderer.sendToHost('user-profile', userName, userImage);
    }
}
*/

ipcRenderer.on('ipc-message', () => {
    applySmoothScroll();
    //detectUserProfile();
});
