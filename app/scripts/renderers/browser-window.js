const {ipcRenderer} = require('electron');

//const packageMeta = require('../../../package.json');
//const appConfig = require('../../configs/application.json');

import Chirit from '../../libs/chirit/Chirit.js';

import RootComponent from '../components/RootComponent.js';
import PageComponent from '../components/PageComponent.js';
import ToolbarComponent from '../components/ToolbarComponent.js';
import StatusbarComponent from '../components/StatusbarComponent.js';

import OcsManagerWsApi from '../api/OcsManagerWsApi.js';

import OcsManagerModule from '../modules/OcsManagerModule.js';

RootComponent.define('root-component');
const stateManager = new Chirit.StateManager('root-component');
stateManager.target.state = stateManager.state;

const ocsManagerUrl = ipcRenderer.sendSync('data', 'ocsManagerUrl');
const ocsManagerWsApi = new OcsManagerWsApi(ocsManagerUrl);

new OcsManagerModule(stateManager, ocsManagerWsApi);

PageComponent.define('page-component');
ToolbarComponent.define('toolbar-component');
StatusbarComponent.define('statusbar-component');

//stateManager.dispatch('');
