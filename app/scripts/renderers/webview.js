const {ipcRenderer} = require('electron');

function applySmoothScroll() {
    let requestId = null;
    let frame = 0;
    const frameMax = 50;
    let amount = 0;
    const amountMax = 7;
    let deltaX = 0;
    let deltaY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;

    const easeOut = (p) => {
        return p * (2 - p);
    };

    const scroll = () => {
        frame++;
        document.scrollingElement.scrollTo({
            left: scrollLeft + (deltaX * easeOut(frame / frameMax)),
            top: scrollTop + (deltaY * easeOut(frame / frameMax))
        });
        if (frame === frameMax) {
            frame = 0;
            amount = 0;
            cancelAnimationFrame(requestId);
        }
        else {
            requestId = requestAnimationFrame(scroll);
        }
    };

    document.scrollingElement.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (Math.sign(deltaX) !== Math.sign(event.deltaX)
            || Math.sign(deltaY) !== Math.sign(event.deltaY)
        ) {
            amount = 0;
        }
        if (amount < amountMax) {
            amount++;
        }
        deltaX = event.deltaX * amount;
        deltaY = event.deltaY * amount;
        scrollLeft = document.scrollingElement.scrollLeft;
        scrollTop = document.scrollingElement.scrollTop;
        if (frame) {
            frame = 0;
            cancelAnimationFrame(requestId);
        }
        scroll();
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
