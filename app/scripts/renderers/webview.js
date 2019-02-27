/*
const {ipcRenderer} = require('electron');

ipcRenderer.on('user-profile', () => {
    const profileMenu = document.querySelector('[rel="profile-menu"]');
    if (profileMenu) {
        const userName = profileMenu.querySelector('span').innerHTML;
        const userImage = profileMenu.querySelector('img').src;
        ipcRenderer.sendToHost('user-profile', userName, userImage);
    }
});
*/
