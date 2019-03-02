const {ipcRenderer} = require('electron');

import Chirit from '../../libs/chirit/Chirit.js';

import OcsManagerApi from '../api/OcsManagerApi.js';

import GeneralTypeHandler from '../handlers/GeneralTypeHandler.js';
import WebviewTypeHandler from '../handlers/WebviewTypeHandler.js';
import OcsManagerTypeHandler from '../handlers/OcsManagerTypeHandler.js';

import BaseComponent from './BaseComponent.js';

export default class RootComponent extends BaseComponent {

    init() {
        document.title = ipcRenderer.sendSync('app', 'package').productName;

        this._stateManager = new Chirit.StateManager(this);

        const ocsManagerApi = new OcsManagerApi(ipcRenderer.sendSync('ocs-manager', 'url'));

        new GeneralTypeHandler(this._stateManager, ipcRenderer);
        new WebviewTypeHandler(this._stateManager, ipcRenderer);
        new OcsManagerTypeHandler(this._stateManager, ipcRenderer, ocsManagerApi);
    }

    render() {
        return `
            ${this.sharedStyle}

            <app-splashscreen></app-splashscreen>

            <app-page id="browser" class="flex-auto flex-column">
            <app-toolbar slot="header"></app-toolbar>
            <app-webview slot="content" class="flex-auto flex-column"></app-webview>
            </app-page>

            <app-collectiondialog></app-collectiondialog>

            <app-aboutdialog></app-aboutdialog>
        `;
    }

    getStateManager() {
        return this._stateManager;
    }

}
