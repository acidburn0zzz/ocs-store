import BaseComponent from './BaseComponent.js';

export default class ToolbarComponent extends BaseComponent {

    init() {
        this._viewHandler_webview_loading = this._viewHandler_webview_loading.bind(this);
        this._viewHandler_webview_page = this._viewHandler_webview_page.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler.add('webview_loading', this._viewHandler_webview_loading);
        this.getStateManager().viewHandler.add('webview_page', this._viewHandler_webview_page);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler.remove('webview_loading', this._viewHandler_webview_loading);
        this.getStateManager().viewHandler.remove('webview_page', this._viewHandler_webview_page);
    }

    render() {
        return `
            ${this.sharedStyle}

            <style>
            :host {
                height: 40px;
            }

            nav[data-toolbar] {
                height: inherit;
                border-bottom: 1px solid var(--color-border);
                background-color: var(--color-widget);
            }
            nav[data-toolbar] ul {
                list-style: none;
                height: inherit;
                margin: 0 4px;
                align-items: center;
            }
            nav[data-toolbar] ul li {
                height: 30px;
                margin: 0 2px;
            }
            nav[data-toolbar] ul li.flex {
                justify-content: center;
            }

            @media (min-width: 900px) {
                nav[data-toolbar] ul li.flex {
                    margin-right: calc(32px * 4);
                }
            }

            nav[data-toolbar] ul li span[data-downloadingbadge] {
                display: inline-block;
                z-index: 1;
                position: relative;
                top: -32px;
                left: 18px;
                padding: 0.3em 0.5em;
                border-radius: 1em;
                background-color: var(--color-information);
                color: #ffffff;
                font-size: 12px;
                line-height: 1;
            }
            nav[data-toolbar] ul li span[data-downloadingbadge="inactive"] {
                display: none;
            }

            div[data-indicator] {
                z-index: 1;
                position: relative;
                top: -2px;
                left: 0;
                width: 50%;
                height: 2px;
                background-color: var(--color-information);
            }
            div[data-indicator="inactive"] {
                display: none;
            }
            div[data-indicator="active"] {
                animation-name: loading;
                animation-duration: 1s;
                animation-iteration-count: infinite;
                animation-direction: alternate;
            }
            @keyframes loading {
                0% {
                    left: -40%;
                }
                100% {
                    left: 90%;
                }
            }
            </style>

            <nav data-toolbar>
            <ul class="flex">
            <li><navbutton-component data-type="webview_navigation" data-action="back" title="Back" disabled></navbutton-component></li>
            <li><navbutton-component data-type="webview_navigation" data-action="forward" title="Forward" disabled></navbutton-component></li>
            <li><navbutton-component data-type="webview_navigation" data-action="reload" title="Reload"></navbutton-component></li>
            <li><navbutton-component data-type="webview_navigation" data-action="home" title="Startpage"></navbutton-component></li>
            <li>
            <navbutton-component data-type="ocsManager_navigation" data-action="collection" title="My Collection"></navbutton-component><br>
            <span data-downloadingbadge="inactive">0</span>
            </li>
            <li class="flex-auto flex"><omnibox-component></omnibox-component></li>
            <li><menubutton-component></menubutton-component></li>
            </ul>
            </nav>

            <div data-indicator="inactive"></div>
        `;
    }

    _viewHandler_webview_loading(state) {
        const indicator = this.contentRoot.querySelector('div[data-indicator]');

        if (state.isLoading) {
            indicator.setAttribute('data-indicator', 'active');

            const reloadButton = this.contentRoot
                .querySelector('navbutton-component[data-type="webview_navigation"][data-action="reload"]');
            if (reloadButton) {
                reloadButton.setAttribute('data-action', 'stop');
            }
        }
        else {
            indicator.setAttribute('data-indicator', 'inactive');

            const stopButton = this.contentRoot
                .querySelector('navbutton-component[data-type="webview_navigation"][data-action="stop"]');
            if (stopButton) {
                stopButton.setAttribute('data-action', 'reload');
            }
        }
    }

    _viewHandler_webview_page(state) {
        const backButton = this.contentRoot
            .querySelector('navbutton-component[data-type="webview_navigation"][data-action="back"]');
        if (state.canGoBack) {
            backButton.removeAttribute('disabled');
        }
        else {
            backButton.setAttribute('disabled', 'disabled');
        }

        const forwardButton = this.contentRoot
            .querySelector('navbutton-component[data-type="webview_navigation"][data-action="forward"]');
        if (state.canGoForward) {
            forwardButton.removeAttribute('disabled');
        }
        else {
            forwardButton.setAttribute('disabled', 'disabled');
        }
    }

    checkOcsManagerDownloadingStatus() {
        const ocsManagerDownloadingState = this.getStateManager().state.get('ocsManager_downloading');

        const downloadingBadget = this.contentRoot
            .querySelector('span[data-downloadingbadge]');
        if (ocsManagerDownloadingState.downloading) {
            downloadingBadget.textContent = '' + ocsManagerDownloadingState.downloading;
            downloadingBadget.setAttribute('data-downloadingbadge', 'active');
        }
        else {
            downloadingBadget.textContent = '0';
            downloadingBadget.setAttribute('data-downloadingbadge', 'inactive');
        }
    }

}
