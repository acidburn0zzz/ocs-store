const {ipcRenderer} = require('electron');

ipcRenderer.on('smooth-scroll', () => {
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
});

/*
ipcRenderer.on('user-profile', () => {
    const profileMenu = document.querySelector('[rel="profile-menu"]');
    if (profileMenu) {
        const userName = profileMenu.querySelector('span').innerHTML;
        const userImage = profileMenu.querySelector('img').src;
        ipcRenderer.sendToHost('user-profile', userName, userImage);
    }
});
*/
