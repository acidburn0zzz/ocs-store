const {ipcRenderer} = require('electron');

import Chirit from '../../libs/chirit/Chirit.js';

import OcsManagerApi from '../api/OcsManagerApi.js';

import GeneralTypeHandler from '../handlers/GeneralTypeHandler.js';
import WebviewTypeHandler from '../handlers/WebviewTypeHandler.js';
import OcsManagerTypeHandler from '../handlers/OcsManagerTypeHandler.js';

import BaseComponent from './BaseComponent.js';

export default class RootComponent extends BaseComponent {

    init() {
        this._stateManager = new Chirit.StateManager(this);

        document.title = ipcRenderer.sendSync('app', 'package').productName;

        const ocsManagerApi = new OcsManagerApi(ipcRenderer.sendSync('ocs-manager', 'url'));

        new GeneralTypeHandler(this._stateManager, ipcRenderer);
        new WebviewTypeHandler(this._stateManager, ipcRenderer);
        new OcsManagerTypeHandler(this._stateManager, ocsManagerApi, ipcRenderer);
    }

    render() {
        return `
            ${this.sharedStyle}

            <switchview-component class="flex-auto flex-column">

            <page-component id="browser" slot="current" class="flex-auto flex-column">
            <toolbar-component slot="header"></toolbar-component>
            <webview-component slot="content" class="flex-auto flex-column"></webview-component>
            <statusbar-component slot="footer"></statusbar-component>
            </page-component>

            </switchview-component>

            <collectiondialog-component></collectiondialog-component>

            <aboutdialog-component></aboutdialog-component>
        `;
    }

    getStateManager() {
        return this._stateManager;
    }

}
