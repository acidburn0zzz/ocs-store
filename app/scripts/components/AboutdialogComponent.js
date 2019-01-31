const {ipcRenderer} = require('electron');

import BaseComponent from './BaseComponent.js';

export default class AboutdialogComponent extends BaseComponent {

    init() {
        this._packageMeta = ipcRenderer.sendSync('app', 'package');
    }

    render() {
        return `
            ${this.sharedStyle}

            <style>
            div[slot="content"] {
                text-align: center;
            }
            div[slot="content"] h4 {
                padding-top: calc(96px + 1em);
                background-position: top center;
                background-repeat: no-repeat;
                background-size: 96px 96px;
            }
            </style>

            <dialog-component>
            <h4 slot="title">About ${this._packageMeta.productName}</h4>
            <div slot="content">
            <h4 class="icon-ocs-store">${this._packageMeta.productName}</h4>
            <p>Version ${this._packageMeta.version}</p>
            <p>${this._packageMeta.description}</p>
            <p>
            Author: ${this._packageMeta.author}<br>
            License: ${this._packageMeta.license}
            </p>
            <p>
            Website: <a href="${this._packageMeta.homepage}" target="webview">${this._packageMeta.homepage}</a><br>
            Project page: <a href="${this._packageMeta.repository}" target="webview">${this._packageMeta.repository}</a><br>
            Report a bug: <a href="${this._packageMeta.bugs}" target="webview">${this._packageMeta.bugs}</a>
            </p>
            </div>
            <button slot="control" class="button" data-action="close">OK</button>
            </dialog-component>
        `;
    }

    componentUpdatedCallback() {
        const dialogComponent = this.contentRoot.querySelector('dialog-component');

        dialogComponent.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                event.preventDefault();
                const anchorElement = event.target.closest('a');
                if (anchorElement.getAttribute('target') === 'webview') {
                    this.dispatch('webview-navigation', {
                        action: 'load',
                        url: anchorElement.href
                    });
                    dialogComponent.close();
                }
            }
        });

        dialogComponent.addEventListener('dialog-close', () => {
            this.parentNode.removeChild(this);
        });
    }

}
