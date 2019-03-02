import Chilit from '../../libs/chirit/Chirit.js';

import BaseComponent from './BaseComponent.js';

export default class CollectiondownloadComponent extends BaseComponent {

    init() {
        this._viewHandler_ocsManager_installing = this._viewHandler_ocsManager_installing.bind(this);
        this._viewHandler_ocsManager_downloading = this._viewHandler_ocsManager_downloading.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_installing', this._viewHandler_ocsManager_installing)
            .add('ocsManager_downloading', this._viewHandler_ocsManager_downloading);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_installing', this._viewHandler_ocsManager_installing)
            .remove('ocsManager_downloading', this._viewHandler_ocsManager_downloading);
    }

    render() {
        return `
            ${this.sharedStyle}

            <style>
            ul[data-container] {
                list-style: none;
                margin: 0;
                overflow: auto;
            }
            ul[data-container] li {
                margin: 1em;
                padding: 1em;
            }
            ul[data-container] li progress[data-progress] {
                width: 70%;
            }
            </style>

            <ul class="flex-auto" data-container></ul>
        `;
    }

    _listItemHtml(installingState) {
        return `
            <li class="widget" data-url="${installingState.metadata.url}">
            <div><span data-name>${installingState.metadata.filename}</span></div>
            <div>
            <progress data-progress value="" max=""></progress>
            <span data-progress></span>
            </div>
            <div><span data-message>${installingState.status.startsWith('success') ? '' : installingState.message}</span></div>
            </li>
        `;
    }

    _viewHandler_ocsManager_installing(state) {
        const downloadItem = this.contentRoot.querySelector(`li[data-url="${state.metadata.url}"]`);
        if (downloadItem) {
            downloadItem.querySelector('span[data-name]').textContent = state.metadata.filename;
            downloadItem.querySelector('span[data-message]').textContent = state.status.startsWith('success') ? '' : state.message;
        }
        else {
            this.contentRoot.querySelector('ul[data-container]')
                .insertAdjacentHTML('afterbegin', this._listItemHtml(state));
        }
    }

    _viewHandler_ocsManager_downloading(state) {
        const downloadItem = this.contentRoot.querySelector(`li[data-url="${state.url}"]`);
        if (downloadItem) {
            const progressElement = downloadItem.querySelector('progress[data-progress]');
            progressElement.value = state.bytesReceived;
            progressElement.max = state.bytesTotal;
            downloadItem.querySelector('span[data-progress]')
                .textContent = Chilit.Utility.convertByteToHumanReadable(state.bytesReceived)
                    + ' / '
                    + Chilit.Utility.convertByteToHumanReadable(state.bytesTotal);
        }
    }

}
