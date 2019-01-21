const {ipcRenderer} = require('electron');

import Chirit from '../../libs/chirit/Chirit.js';

import RootComponent from '../components/RootComponent.js';
import PageComponent from '../components/PageComponent.js';
import ToolbarComponent from '../components/ToolbarComponent.js';
import StatusbarComponent from '../components/StatusbarComponent.js';
import WebviewComponent from '../components/WebviewComponent.js';
import MenubuttonComponent from '../components/MenubuttonComponent.js';

import OcsManagerWsApi from '../api/OcsManagerWsApi.js';

import OcsManagerModule from '../modules/OcsManagerModule.js';
import WebviewModule from '../modules/WebviewModule.js';

document.title = ipcRenderer.sendSync('app', 'package').productName;

RootComponent.define('root-component');
const stateManager = new Chirit.StateManager('root-component');
stateManager.target.state = stateManager.state;

const ocsManagerWsApi = new OcsManagerWsApi(ipcRenderer.sendSync('ocs-manager', 'url'));

new OcsManagerModule(stateManager, ocsManagerWsApi);

PageComponent.define('page-component');
ToolbarComponent.define('toolbar-component');
StatusbarComponent.define('statusbar-component');
WebviewComponent.define('webview-component');
MenubuttonComponent.define('menubutton-component');

//stateManager.dispatch('');
