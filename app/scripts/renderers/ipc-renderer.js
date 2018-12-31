const electron = require('electron');
const url = require('url');

{

    const ipcRenderer = electron.ipcRenderer;

    const memberSites = [
        'opendesktop.org',

        'appimagehub.com',
        'linux-apps.com',
        'linux-appimages.org',

        'app-addons.org',
        'addons.videolan.org',
        'share.krita.org',

        'cinnamon-look.org',
        'compiz-themes.org',
        'enlightenment-themes.org',
        'gnome-look.org',
        'mate-look.org',
        'store.kde.org',
        'trinity-look.org',
        'xfce-look.org',
        'box-look.org',

        'cccliparts.org',
        'free-artwork.org',

        'historical-look.org',
    ];

    function modifyDocument() {
        if (document.querySelector('[rel="profile-menu"]')) {
            const profileMenu = document.querySelector('[rel="profile-menu"]');
            const userName = profileMenu.querySelector('span').innerHTML;
            const userImage = profileMenu.querySelector('img').getAttribute('src');
            ipcRenderer.sendToHost('user-profile', userName, userImage);
        }
    }

    //function modifyStyle() {}

    function modifyEvent() {
        document.body.addEventListener('click', (event) => {
            if (event.target.closest('[href]')) {
                const targetElement = event.target.closest('[href]');

                let targetUrl = '';
                if (targetElement.getAttribute('data-link-org')) {
                    targetUrl = targetElement.getAttribute('data-link-org');
                }
                else {
                    targetUrl = targetElement.getAttribute('href');
                }

                const parsedUrl = url.parse(targetUrl);

                // Parse page URL
                // https://www.opendesktop.org/p/123456789/?key=val#hash
                // Then make provider key and content id
                // providerKey = https://www.opendesktop.org/ocs/v1/
                // contentId = 123456789
                const pageUrlParts = document.URL.split('?')[0].split('#')[0].split('/p/');
                let providerKey = '';
                let contentId = '';
                if (pageUrlParts[0] && pageUrlParts[1]) {
                    providerKey = `${pageUrlParts[0]}/ocs/v1/`;
                    contentId = pageUrlParts[1].split('/')[0];
                }

                if (parsedUrl.protocol === 'ocs:' || parsedUrl.protocol === 'ocss:') {
                    event.preventDefault();
                    ipcRenderer.sendToHost('ocs-url', targetUrl, providerKey, contentId);
                }
                else if (parsedUrl.hostname) {
                    let isMemberSite = false;
                    for (const memberSite of memberSites) {
                        if (parsedUrl.hostname.endsWith(memberSite)) {
                            isMemberSite = true;
                            break;
                        }
                    }

                    if (parsedUrl.hostname === 'dl.opendesktop.org') {
                        event.preventDefault();
                        const ocsUrl = `ocs://download?url=${encodeURIComponent(targetUrl)}&type=downloads`;
                        ipcRenderer.sendToHost('ocs-url', ocsUrl, providerKey, contentId);
                    }
                    else if (isMemberSite) {
                        if (targetElement.getAttribute('target')) {
                            event.preventDefault();
                            location.href = targetUrl;
                        }
                    }
                    else {
                        event.preventDefault();
                        event.stopPropagation();
                        ipcRenderer.sendToHost('external-url', targetUrl);
                    }
                }
                else {
                    if (targetElement.getAttribute('target')) {
                        event.preventDefault();
                        location.href = targetUrl;
                    }
                }
            }
        }, false);
    }

    ipcRenderer.on('dom-modify', () => {
        modifyDocument();
        //modifyStyle();
        modifyEvent();
    });

}
