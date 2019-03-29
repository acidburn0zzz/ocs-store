import BaseComponent from './common/BaseComponent.js';

export default class OmniboxComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return ['data-state', 'data-auto-close-state'];
    }

    init() {
        this.state = {
            url: '',
            title: '',
            startPage: ''
        };

        this.contentRoot.addEventListener('click', this._handleClick.bind(this));

        this._viewHandler_webview_loading = this._viewHandler_webview_loading.bind(this);
        this._viewHandler_webview_page = this._viewHandler_webview_page.bind(this);
        this._viewHandler_ocsManager_updateAvailableItems = this._viewHandler_ocsManager_updateAvailableItems.bind(this);
        this._viewHandler_ocsManager_metadataSet = this._viewHandler_ocsManager_metadataSet.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('webview_loading', this._viewHandler_webview_loading)
            .add('webview_page', this._viewHandler_webview_page)
            .add('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems)
            .add('ocsManager_metadataSet', this._viewHandler_ocsManager_metadataSet);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('webview_loading', this._viewHandler_webview_loading)
            .remove('webview_page', this._viewHandler_webview_page)
            .remove('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems)
            .remove('ocsManager_metadataSet', this._viewHandler_ocsManager_metadataSet);
    }

    render() {
        const state = this.getAttribute('data-state') || 'inactive';
        const autoCloseState = this.getAttribute('data-auto-close-state') || 'active';

        const autoCloseAction = (autoCloseState === 'active') ? 'omnibox_autoClose' : '';

        return this.html`
            <style>
            ${this.sharedStyle}
            @import url(styles/material-icons.css);
            </style>

            <style>
            :host {
                display: inline-block;
                width: 500px;
                height: 30px;
            }

            div[data-omnibox] {
                position: relative;
                width: inherit;
                height: inherit;
            }
            div[data-omnibox]::after {
                --border-width: 3px;
                display: block;
                content: '';
                z-index: 9;
                position: absolute;
                top: calc(-1 * var(--border-width));
                left: calc(-1 * var(--border-width));
                width: calc(100% + var(--border-width) * 2);
                height: calc(100% + var(--border-width) * 2);
                border-radius: calc(var(--border-width) * 2);
            }
            div[data-omnibox][data-update-state="active"]::after {
                background-color: var(--color-important);
            }
            div[data-omnibox][data-download-state="active"]::after {
                background: linear-gradient(90deg, transparent, var(--color-information) 50%, transparent);
                background-size: 300% 300%;
                animation: gradient 2s ease-in-out infinite alternate;
            }
            @keyframes gradient {
                0% {
                    background-position: 0% 0%;
                }
                100% {
                    background-position: 100% 0%;
                }
            }
            div[data-omnibox] div[data-wrapper] {
                z-index: 10;
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 3px;
                background-color: var(--color-widget);
                overflow: hidden;
            }
            div[data-omnibox] div[data-content] {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                width: 100%;
                height: 100%;
                background-color: var(--color-active-secondary);
                line-height: 1;
                transition: background-color 0.2s ease-out;
            }
            div[data-omnibox] div[data-content]:hover {
                background-color: var(--color-active);
            }
            div[data-omnibox] div[data-content] h3 {
                flex: 1 1 auto;
                border-right: 1px solid var(--color-border);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                line-height: 24px;
                text-align: center;
                cursor: pointer;
            }
            div[data-omnibox] div[data-content] div {
                display: flex;
                flex: 0 0 auto;
                align-items: center;
                justify-content: center;
                width: 30px;
            }
            div[data-omnibox] app-indicator {
                position: relative;
                top: -2px;
            }

            div[data-palette] {
                z-index: 1000;
                position: relative;
                top: 0;
                left: 0;
                width: inherit;
                padding: 1em;
                border: 1px solid var(--color-border);
                border-radius: 5px;
                box-shadow: 0 5px 20px 0 var(--color-shadow);
                background-color: var(--color-content);
            }
            div[data-palette][data-state="inactive"] {
                display: none;
            }
            div[data-palette] div[data-content] {
                padding: 1em;
                border-bottom: 1px solid var(--color-border);
            }
            div[data-palette] div[data-content]:last-child {
                border-bottom: 0;
            }
            div[data-palette] div[data-content][data-update-state] a {
                color: var(--color-important);
            }
            div[data-palette] div[data-content][data-update-state="inactive"] {
                display: none;
            }
            div[data-palette] div[data-content][data-download-state] a {
                color: var(--color-information);
            }
            div[data-palette] div[data-content][data-download-state="inactive"] {
                display: none;
            }
            div[data-palette] div[data-content] h4 {
                margin: 1em 0;
                text-align: center;
            }
            div[data-palette] div[data-content] h4 i {
                position: relative;
                top: 3px;
            }
            div[data-palette] div[data-content] p {
                text-align: center;
            }
            div[data-palette] div[data-content] nav ul {
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
            }
            div[data-palette] div[data-content] nav ul li {
                width: 50%;
                padding: 5px;
            }
            div[data-palette] div[data-content] nav ul li app-button {
                width: 100%;
            }

            div[data-overlay] {
                z-index: 999;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            div[data-overlay][data-state="inactive"] {
                display: none;
            }
            </style>

            <div data-omnibox data-update-state="inactive" data-download-state="inactive">
            <div data-wrapper>
            <div data-content>
            <div></div>
            <h3 data-action="omnibox_open">${this.state.title}</h3>
            <div>
            <app-iconbutton data-action="ocsManager_openUrl" data-url="${this.state.url}"
                data-title="Open in Browser" data-icon="open_in_browser" data-size="small"></app-iconbutton>
            </div>
            </div>
            <app-indicator></app-indicator>
            </div>
            </div>

            <div data-palette data-state="${state}" class="fade-in">
            <div data-content data-update-state="inactive">
            <h4><i class="material-icons md-small">update</i> Update</h4>
            <p data-message></p>
            </div>
            <div data-content data-download-state="inactive">
            <h4><i class="material-icons md-small">cloud_download</i> Download</h4>
            <p data-message></p>
            </div>
            <div data-content>
            <h4><i class="material-icons md-small">home</i> Choose Startpage</h4>
            <nav>
            <ul>
            <li><app-button data-action="webview_startPage" data-url="https://www.opendesktop.org/">opendesktop.org</app-button></li>
            <li><app-button data-action="webview_startPage" data-url="https://www.opendesktop.org/s/Gnome">gnome-look.org</app-button></li>
            <li><app-button data-action="webview_startPage" data-url="https://store.kde.org/">store.kde.org</app-button></li>
            <li><app-button data-action="webview_startPage" data-url="https://www.opendesktop.org/s/XFCE">xfce-look.org</app-button></li>
            <li><app-button data-action="webview_startPage" data-url="https://www.opendesktop.org/s/Window-Managers">box-look.org</app-button></li>
            <li><app-button data-action="webview_startPage" data-url="https://www.opendesktop.org/s/Enlightenment">enlightenment-themes.org</app-button></li>
            </ul>
            </nav>
            </div>
            </div>

            <div data-overlay data-state="${state}" data-action="${autoCloseAction}"></div>
        `;
    }

    componentUpdatedCallback() {
        if (this.contentRoot.querySelector('app-button[data-action="webview_startPage"][data-checked]')) {
            this.contentRoot.querySelector('app-button[data-action="webview_startPage"][data-checked]').removeAttribute('data-checked');
        }

        if (this.contentRoot.querySelector(`app-button[data-action="webview_startPage"][data-url="${this.state.startPage}"]`)) {
            this.contentRoot.querySelector(`app-button[data-action="webview_startPage"][data-url="${this.state.startPage}"]`).setAttribute('data-checked', 'data-checked');
        }
    }

    open() {
        this.contentRoot.querySelector('div[data-palette]').setAttribute('data-state', 'active');
        this.contentRoot.querySelector('div[data-overlay]').setAttribute('data-state', 'active');
        this.dispatch('omnibox_open', {});
    }

    close() {
        this.contentRoot.querySelector('div[data-palette]').setAttribute('data-state', 'inactive');
        this.contentRoot.querySelector('div[data-overlay]').setAttribute('data-state', 'inactive');
        this.dispatch('omnibox_close', {});
    }

    _handleClick(event) {
        if (event.target.closest('[data-action="omnibox_open"]')) {
            this.open();
            return;
        }
        else if (event.target.getAttribute('data-action') === 'omnibox_autoClose'
            || event.target.closest('[data-action="omnibox_close"]')
        ) {
            this.close();
            return;
        }

        let target = null;
        if (event.target.closest('app-iconbutton[data-action]')) {
            target = event.target.closest('app-iconbutton[data-action]');
        }
        else if (event.target.closest('app-button[data-action]')) {
            target = event.target.closest('app-button[data-action]');
        }
        else if (event.target.closest('a[data-action]')) {
            event.preventDefault();
            target = event.target.closest('a[data-action]');
        }
        else {
            return;
        }

        switch (target.getAttribute('data-action')) {
            case 'ocsManager_openUrl': {
                this.dispatch('ocsManager_openUrl', {url: target.getAttribute('data-url')});
                break;
            }
            case 'webview_startPage': {
                this.dispatch('webview_startPage', {url: target.getAttribute('data-url')});
                this.close();
                break;
            }
            case 'ocsManager_collection': {
                this.dispatch('ocsManager_collection', {view: target.getAttribute('data-view')});
                this.close();
                break;
            }
        }
    }

    _viewHandler_webview_loading(state) {
        const indicator = this.contentRoot.querySelector('div[data-omnibox] app-indicator');
        state.isLoading ? indicator.start() : indicator.stop();
    }

    _viewHandler_webview_page(state) {
        this.update({...this.state, ...state});
    }

    _viewHandler_ocsManager_updateAvailableItems(state) {
        this.contentRoot.querySelector('div[data-omnibox]').setAttribute('data-update-state', state.count ? 'active' : 'inactive');

        const updateContent = this.contentRoot.querySelector('div[data-palette] div[data-content][data-update-state]');
        updateContent.setAttribute('data-update-state', state.count ? 'active' : 'inactive');
        let messageHtml = '';
        if (state.count) {
            let messageText = `${state.count} item(s) update available`;
            messageHtml = `<a href="#" data-action="ocsManager_collection" data-view="update">${messageText}</a>`;
        }
        updateContent.querySelector('p[data-message]').innerHTML = messageHtml;
    }

    _viewHandler_ocsManager_metadataSet(state) {
        this.contentRoot.querySelector('div[data-omnibox]').setAttribute('data-download-state', state.count ? 'active' : 'inactive');

        const downloadContent = this.contentRoot.querySelector('div[data-palette] div[data-content][data-download-state]');
        downloadContent.setAttribute('data-download-state', state.count ? 'active' : 'inactive');
        let messageHtml = '';
        if (state.count) {
            let messageText = state.metadataSet[Object.keys(state.metadataSet)[0]].filename;
            messageText += (state.count > 1) ? ` and ${state.count - 1} file(s)` : '';
            messageHtml = `<a href="#" data-action="ocsManager_collection" data-view="download">${messageText}</a>`;
        }
        downloadContent.querySelector('p[data-message]').innerHTML = messageHtml;
    }

}
