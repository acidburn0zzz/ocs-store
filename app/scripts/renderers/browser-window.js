const {ipcRenderer} = require('electron');

import Chirit from '../../libs/chirit/Chirit.js';

import GeneralHandler from '../handlers/GeneralHandler.js';
import WebviewHandler from '../handlers/WebviewHandler.js';
import OcsManagerHandler from '../handlers/OcsManagerHandler.js';

import OcsManagerApi from '../api/OcsManagerApi.js';

import RootComponent from '../components/RootComponent.js';
import PageComponent from '../components/PageComponent.js';
import ToolbarComponent from '../components/ToolbarComponent.js';
import StatusbarComponent from '../components/StatusbarComponent.js';
import WebviewComponent from '../components/WebviewComponent.js';
import ButtonComponent from '../components/ButtonComponent.js';
import NavbuttonComponent from '../components/NavbuttonComponent.js';
import MenubuttonComponent from '../components/MenubuttonComponent.js';
import OmniboxComponent from '../components/OmniboxComponent.js';
import DialogComponent from '../components/DialogComponent.js';
import AboutdialogComponent from '../components/AboutdialogComponent.js';

RootComponent.define('root-component');
const stateManager = new Chirit.StateManager('root-component');
stateManager.target.state = stateManager.state;

const ocsManagerApi = new OcsManagerApi(ipcRenderer.sendSync('ocs-manager', 'url'));

new GeneralHandler(stateManager, ipcRenderer);
new WebviewHandler(stateManager, ipcRenderer);
new OcsManagerHandler(stateManager, ocsManagerApi);

PageComponent.define('page-component');
ToolbarComponent.define('toolbar-component');
StatusbarComponent.define('statusbar-component');
WebviewComponent.define('webview-component');
ButtonComponent.define('button-component');
NavbuttonComponent.define('navbutton-component');
MenubuttonComponent.define('menubutton-component');
OmniboxComponent.define('omnibox-component');
DialogComponent.define('dialog-component');
AboutdialogComponent.define('aboutdialog-component');

stateManager.dispatch('ocsManager_initial', {});
