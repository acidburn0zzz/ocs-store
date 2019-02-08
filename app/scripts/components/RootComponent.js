const {ipcRenderer} = require('electron');

import Chirit from '../../libs/chirit/Chirit.js';

import OcsManagerApi from '../api/OcsManagerApi.js';

import GeneralHandler from '../handlers/GeneralHandler.js';
import WebviewHandler from '../handlers/WebviewHandler.js';
import OcsManagerHandler from '../handlers/OcsManagerHandler.js';

import BaseComponent from './BaseComponent.js';

export default class RootComponent extends BaseComponent {

    init() {
        this.stateManager = new Chirit.StateManager(this);

        const ocsManagerApi = new OcsManagerApi(ipcRenderer.sendSync('ocs-manager', 'url'));

        new GeneralHandler(this.stateManager, ipcRenderer);
        new WebviewHandler(this.stateManager, ipcRenderer);
        new OcsManagerHandler(this.stateManager, ocsManagerApi);
    }

    render() {
        return `
            ${this.sharedStyle}

            <pageswitcher-component class="flex-auto flex-column">

            <page-component id="browser" slot="page" class="flex-auto flex-column">
            <toolbar-component slot="header"></toolbar-component>
            <webview-component slot="content" class="flex-auto flex-column"></webview-component>
            <statusbar-component slot="footer"></statusbar-component>
            </page-component>

            </pageswitcher-component>

            <collectiondialog-component></collectiondialog-component>
        `;
    }

    componentUpdatedCallback() {
        this.stateManager.dispatch('ocsManager_initial', {});
    }

}
