const {ipcRenderer} = require('electron');

ipcRenderer.on('smooth-scroll', () => {
    let scrollLeft = document.scrollingElement.scrollLeft;
    let scrollTop = document.scrollingElement.scrollTop;
    let previousScrollLeft = 0;
    let previousScrollTop = 0;
    let intervalId = null;

    document.scrollingElement.addEventListener('wheel', (event) => {
        event.preventDefault();

        scrollLeft += event.deltaX;
        scrollTop += event.deltaY;

        if (intervalId === null) {
            intervalId = setInterval(() => {
                if (scrollLeft === previousScrollLeft && scrollTop === previousScrollTop) {
                    window.clearInterval(intervalId);
                    scrollLeft = document.scrollingElement.scrollLeft;
                    scrollTop = document.scrollingElement.scrollTop;
                    previousScrollLeft = 0;
                    previousScrollTop = 0;
                    intervalId = null;
                }
                else {
                    document.scrollingElement.scrollTo({
                        left: scrollLeft,
                        top: scrollTop,
                        behavior: 'smooth'
                    });
                    previousScrollLeft = scrollLeft;
                    previousScrollTop = scrollTop;
                }
            }, 100);
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
