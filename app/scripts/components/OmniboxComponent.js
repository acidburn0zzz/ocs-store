import BaseComponent from './common/BaseComponent.js';

export default class OmniboxComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return ['data-status', 'data-auto-close-status'];
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
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('webview_loading', this._viewHandler_webview_loading)
            .add('webview_page', this._viewHandler_webview_page);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('webview_loading', this._viewHandler_webview_loading)
            .remove('webview_page', this._viewHandler_webview_page);
    }

    render() {
        const status = this.getAttribute('data-status') || 'inactive';
        const autoCloseStatus = this.getAttribute('data-auto-close-status') || 'active';

        const autoCloseAction = (autoCloseStatus === 'active') ? 'omnibox_autoClose' : '';

        return `
            ${this.sharedStyle}

            <style>
            @import url(styles/material-icons.css);

            :host {
                display: inline-block;
                width: 500px;
                height: 30px;
            }

            div[data-omnibox] {
                width: inherit;
                height: inherit;
                border-radius: 5px;
                background-color: var(--color-active-secondary);
                overflow: hidden;
                transition: background-color 0.2s ease-out;
            }
            div[data-omnibox]:hover {
                background-color: var(--color-active);
            }
            div[data-omnibox] div[data-content] {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                width: inherit;
                height: inherit;
                line-height: 1;
            }
            div[data-omnibox] div[data-content] div {
                flex: 0 0 auto;
                width: 30px;
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
                box-shadow: 0 10px 30px var(--color-shadow);
                background-color: var(--color-content);
            }
            div[data-palette][data-status="inactive"] {
                display: none;
            }
            div[data-palette] h4 {
                margin: 1em 0;
                color: var(--color-text);
                text-align: center;
            }
            div[data-palette] h4 i {
                position: relative;
                top: 3px;
            }
            div[data-palette] ul {
                list-style: none;
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
            }
            div[data-palette] ul li {
                width: 50%;
                padding: 5px;
            }
            div[data-palette] ul li button {
                -webkit-appearance: none;
                appearance: none;
                display: inline-block;
                width: 100%;
                padding: 0.4em 0.2em;
                border: 1px solid var(--color-border);
                border-radius: 3px;
                background-color: var(--color-content);
                color: var(--color-text);
                line-height: 1;
                outline: none;
                cursor: pointer;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            div[data-palette] ul li button:hover {
                background-color: var(--color-active-secondary);
            }
            div[data-palette] ul li button[data-action="webview_startPage"][data-url="${this.state.startPage}"] {
                border-color: var(--color-information);
            }

            div[data-overlay] {
                z-index: 999;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            div[data-overlay][data-status="inactive"] {
                display: none;
            }
            </style>

            <div data-omnibox>
            <div data-content>
            <div></div>
            <h3 data-action="omnibox_open">${this.state.title}</h3>
            <div>
            <app-iconbutton data-action="ocsManager_openUrl" data-url="${this.state.url}"
                data-title="Open in browser" data-icon="open_in_browser" data-size="medium"></app-iconbutton>
            </div>
            </div>
            <app-indicator data-status="inactive"></app-indicator>
            </div>

            <div data-palette data-status="${status}" class="fade-in">
            <h4><i class="material-icons md-small">home</i> Choose Startpage</h4>
            <ul>
            <li><button data-action="webview_startPage" data-url="https://www.opendesktop.org/">opendesktop.org</button></li>
            <li><button data-action="webview_startPage" data-url="https://www.opendesktop.org/s/Gnome">gnome-look.org</button></li>
            <li><button data-action="webview_startPage" data-url="https://store.kde.org/">store.kde.org</button></li>
            <li><button data-action="webview_startPage" data-url="https://www.opendesktop.org/s/XFCE">xfce-look.org</button></li>
            <li><button data-action="webview_startPage" data-url="https://www.opendesktop.org/s/Window-Managers">box-look.org</button></li>
            <li><button data-action="webview_startPage" data-url="https://www.opendesktop.org/s/Enlightenment">enlightenment-themes.org</button></li>
            </ul>
            </div>

            <div data-overlay data-status="${status}" data-action="${autoCloseAction}"></div>
        `;
    }

    open() {
        this.contentRoot.querySelector('div[data-palette]').setAttribute('data-status', 'active');
        this.contentRoot.querySelector('div[data-overlay]').setAttribute('data-status', 'active');
        this.dispatch('omnibox_open', {});
    }

    close() {
        this.contentRoot.querySelector('div[data-palette]').setAttribute('data-status', 'inactive');
        this.contentRoot.querySelector('div[data-overlay]').setAttribute('data-status', 'inactive');
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

        let targetElement = null;
        if (event.target.closest('app-iconbutton[data-action]')) {
            targetElement = event.target.closest('app-iconbutton[data-action]');
        }
        else if (event.target.closest('button[data-action]')) {
            targetElement = event.target.closest('button[data-action]');
        }
        else {
            return;
        }

        switch (targetElement.getAttribute('data-action')) {
            case 'ocsManager_openUrl':
                this.dispatch('ocsManager_openUrl', {url: targetElement.getAttribute('data-url')});
                break;
            case 'webview_startPage':
                this.dispatch('webview_startPage', {url: targetElement.getAttribute('data-url')});
                break;
        }
    }

    _viewHandler_webview_loading(state) {
        this.contentRoot.querySelector('app-indicator').setAttribute('data-status', state.isLoading ? 'active' : 'inactive');
    }

    _viewHandler_webview_page(state) {
        this.update({...this.state, ...state});
    }

}
