const {ipcRenderer} = require('electron');

import Chirit from '../../libs/chirit/Chirit.js';

import OcsManagerApi from '../api/OcsManagerApi.js';

import GeneralHandler from '../handlers/GeneralHandler.js';
import WebviewHandler from '../handlers/WebviewHandler.js';
import OcsManagerHandler from '../handlers/OcsManagerHandler.js';

import BaseComponent from './BaseComponent.js';

export default class RootComponent extends BaseComponent {

    init() {
        this._stateManager = new Chirit.StateManager(this);

        document.title = ipcRenderer.sendSync('app', 'package').productName;

        const ocsManagerApi = new OcsManagerApi(ipcRenderer.sendSync('ocs-manager', 'url'));

        new GeneralHandler(this._stateManager, ipcRenderer);
        new WebviewHandler(this._stateManager, ipcRenderer);
        new OcsManagerHandler(this._stateManager, ocsManagerApi);
    }

    render() {
        return `
            ${this.sharedStyle}

            <switchview-component class="flex-auto flex-column">

            <page-component id="browser" slot="page" class="flex-auto flex-column">
            <toolbar-component slot="header"></toolbar-component>
            <webview-component slot="content" class="flex-auto flex-column"></webview-component>
            <statusbar-component slot="footer"></statusbar-component>
            </page-component>

            </switchview-component>

            <collectiondialog-component></collectiondialog-component>

            <aboutdialog-component></aboutdialog-component>
        `;
    }

    componentUpdatedCallback() {
        this._stateManager.dispatch('ocsManager_initial', {});
    }

    getStateManager() {
        return this._stateManager;
    }

}
