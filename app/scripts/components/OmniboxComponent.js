const {ipcRenderer} = require('electron');

import BaseComponent from './BaseComponent.js';

export default class OmniboxComponent extends BaseComponent {

    init() {
        this._omniboxElement = null;
        this._paletteElement = null;
        this._togglerElement = null;
    }

    render() {
        const webviewPageState = this.rootState.get('webview-page');
        const url = webviewPageState.url || '';
        const title = webviewPageState.title || '';
        const startPage = ipcRenderer.sendSync('store-application', 'startPage');

        return `
            ${this.sharedStyle}

            <style>
            :host {
                display: inline-block;
                width: 500px;
                height: 30px;
            }

            div[data-omnibox] {
                width: inherit;
                height: inherit;
            }
            div[data-omnibox] button.button {
                box-shadow: none;
                width: inherit;
                height: inherit;
                border: 0;
                background-color: rgba(100,100,100,0.1);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                transition: background-color 0.2s ease-out;
            }
            div[data-omnibox] button.button:hover {
                border: 0;
                background-color: rgba(0,0,0,0.1);
            }
            div[data-omnibox="inactive"] button.button {
                background-color: rgba(0,0,0,0.1);
            }

            div[data-palette] {
                position: absolute;
                z-index: 2000;
                width: inherit;
                background-color: #ffffff;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            div[data-palette] div.widget-content {
                margin: 1em 0;
            }
            div[data-palette] h4 {
                padding-top: 24px;
                background-position: top center;
                background-repeat: no-repeat;
                background-size: 24px 24px;
                color: #666666;
                font-weight: normal;
                text-align: center;
            }
            div[data-palette] ul {
                list-style: none;
                margin: 0;
                flex-wrap: wrap;
                justify-content: center;
            }
            div[data-palette] ul li {
                width: 50%;
                padding: 5px;
            }
            div[data-palette] ul li button.button {
                box-shadow: none;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            div[data-palette] ul li button.button[data-startpage-url="${startPage}"] {
                border-color: #68a4d9;
            }
            div[data-palette="inactive"] {
                display: none;
            }

            div[data-toggler] {
                position: absolute;
                z-index: 1000;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            div[data-toggler="inactive"] {
                display: none;
            }
            </style>

            <div data-omnibox="active">
            <button class="button">${title}</button>
            </div>

            <div class="widget" data-palette="inactive">
            <div class="widget-header">
            <button class="button-accept width-1of1" data-external-url="${url}">Open in Browser</button>
            </div>
            <div class="widget-content">
            <h4 class="icon-home">Choose Startpage</h4>
            <ul class="flex">
            <li><button class="button width-1of1" data-startpage-url="https://www.opendesktop.org/">opendesktop.org</button></li>
            <li><button class="button width-1of1" data-startpage-url="https://www.opendesktop.org/s/Gnome">gnome-look.org</button></li>
            <li><button class="button width-1of1" data-startpage-url="https://store.kde.org/">store.kde.org</button></li>
            <li><button class="button width-1of1" data-startpage-url="https://www.opendesktop.org/s/XFCE">xfce-look.org</button></li>
            <li><button class="button width-1of1" data-startpage-url="https://www.opendesktop.org/s/Window-Managers">box-look.org</button></li>
            <li><button class="button width-1of1" data-startpage-url="https://www.opendesktop.org/s/Enlightenment">enlightenment-themes.org</button></li>
            </ul>
            </div>
            </div>

            <div data-toggler="inactive"></div>
        `;
    }

    componentUpdatedCallback() {
        this._omniboxElement = this.contentRoot.querySelector('div[data-omnibox]');
        this._paletteElement = this.contentRoot.querySelector('div[data-palette]');
        this._togglerElement = this.contentRoot.querySelector('div[data-toggler]');

        this._omniboxElement.addEventListener('click', this._toggle.bind(this), false);
        this._togglerElement.addEventListener('click', this._toggle.bind(this), false);

        this._paletteElement.addEventListener('click', (event) => {
            if (event.target.closest('button[data-external-url]')) {
                const url = event.target.closest('button[data-external-url]')
                    .getAttribute('data-external-url');
                this.dispatch('external-url', {url: url});
                this._toggle();
            }
            else if (event.target.closest('button[data-startpage-url]')) {
                const url = event.target.closest('button[data-startpage-url]')
                    .getAttribute('data-startpage-url');
                this.dispatch('webview-startpage', {url: url});
                this._toggle();
            }
        }, false);
    }

    _toggle() {
        this._omniboxElement.setAttribute(
            'data-omnibox',
            (this._omniboxElement.getAttribute('data-omnibox') === 'active') ? 'inactive' : 'active'
        );
        this._paletteElement.setAttribute(
            'data-palette',
            (this._paletteElement.getAttribute('data-palette') === 'active') ? 'inactive' : 'active'
        );
        this._togglerElement.setAttribute(
            'data-toggler',
            (this._togglerElement.getAttribute('data-toggler') === 'active') ? 'inactive' : 'active'
        );
    }

}
