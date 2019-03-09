const {ipcRenderer} = require('electron');

import Chirit from '../../libs/chirit/Chirit.js';

import OcsManagerApi from '../api/OcsManagerApi.js';

import GeneralHandler from '../handlers/GeneralHandler.js';
import WebviewHandler from '../handlers/WebviewHandler.js';
import OcsManagerHandler from '../handlers/OcsManagerHandler.js';

import BaseComponent from './common/BaseComponent.js';

export default class RootComponent extends BaseComponent {

    init() {
        document.title = ipcRenderer.sendSync('app', 'package').productName;

        this._stateManager = new Chirit.StateManager(this);

        const ocsManagerApi = new OcsManagerApi(ipcRenderer.sendSync('ocs-manager', 'url'));

        new GeneralHandler(this._stateManager, ipcRenderer);
        new WebviewHandler(this._stateManager, ipcRenderer);
        new OcsManagerHandler(this._stateManager, ipcRenderer, ocsManagerApi);
    }

    render() {
        return `
            <style>
            ${this.sharedStyle}
            </style>

            <style>
            app-page {
                width: 100%;
                height: 100%;
            }
            </style>

            <app-page id="browser">
            <app-toolbar slot="header"></app-toolbar>
            <app-webview slot="content"></app-webview>
            </app-page>

            <app-collectiondialog></app-collectiondialog>
            <app-aboutdialog></app-aboutdialog>
            <app-splashscreen></app-splashscreen>
        `;
    }

    getStateManager() {
        return this._stateManager;
    }

}
