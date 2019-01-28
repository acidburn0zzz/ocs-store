import BaseComponent from './BaseComponent.js';

export default class ToolbarComponent extends BaseComponent {

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

            div[data-indicator] {
                z-index: 1;
                position: relative;
                top: -2px;
                left: 0;
                height: 2px;
                background-color: var(--color-information);
            }
            div[data-indicator="inactive"] {
                display: none;
            }
            div[data-indicator="active"] {
                animation-name: loading;
                animation-duration: 2s;
                animation-iteration-count: infinite;
                animation-direction: alternate;
            }
            @keyframes loading {
                0% {
                    opacity: 0.3;
                }
                100% {
                    opacity: 1.0;
                }
            }
            </style>

            <nav data-toolbar>
            <ul class="flex">
            <li><navbutton-component data-type="webview" data-action="back" title="Back" disabled></navbutton-component></li>
            <li><navbutton-component data-type="webview" data-action="forward" title="Forward" disabled></navbutton-component></li>
            <li><navbutton-component data-type="webview" data-action="reload" title="Reload"></navbutton-component></li>
            <li><navbutton-component data-type="webview" data-action="home" title="Startpage"></navbutton-component></li>
            <li><navbutton-component data-type="collection" data-action="collection" title="Collection"></navbutton-component></li>
            <li class="flex-auto flex"><omnibox-component></omnibox-component></li>
            <li><menubutton-component></menubutton-component></li>
            </ul>
            </nav>

            <div data-indicator="inactive"></div>
        `;
    }

    checkWebviewLoadingStatus() {
        const webviewLoadingState = this.rootState.get('webview-loading');
        if (webviewLoadingState.isLoading) {
            const reloadButton = this.contentRoot
                .querySelector('navbutton-component[data-type="webview"][data-action="reload"]');
            if (reloadButton) {
                reloadButton.setAttribute('data-action', 'stop');
            }

            this.contentRoot.querySelector('div[data-indicator]')
                .setAttribute('data-indicator', 'active');
        }
        else {
            const stopButton = this.contentRoot
                .querySelector('navbutton-component[data-type="webview"][data-action="stop"]');
            if (stopButton) {
                stopButton.setAttribute('data-action', 'reload');
            }

            this.contentRoot.querySelector('div[data-indicator]')
                .setAttribute('data-indicator', 'inactive');
        }
    }

    checkWebviewPageStatus() {
        const webviewPageState = this.rootState.get('webview-page');

        const backButton = this.contentRoot
            .querySelector('navbutton-component[data-type="webview"][data-action="back"]');
        if (webviewPageState.canGoBack) {
            backButton.removeAttribute('disabled');
        }
        else {
            backButton.setAttribute('disabled', 'disabled');
        }

        const forwardButton = this.contentRoot
            .querySelector('navbutton-component[data-type="webview"][data-action="forward"]');
        if (webviewPageState.canGoForward) {
            forwardButton.removeAttribute('disabled');
        }
        else {
            forwardButton.setAttribute('disabled', 'disabled');
        }
    }

}
