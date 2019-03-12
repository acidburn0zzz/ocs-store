import Chilit from '../../libs/chirit/Chirit.js';

import BaseComponent from './common/BaseComponent.js';

export default class CollectiondownloadComponent extends BaseComponent {

    init() {
        this._viewHandler_ocsManager_installing = this._viewHandler_ocsManager_installing.bind(this);
        this._viewHandler_ocsManager_downloadProgress = this._viewHandler_ocsManager_downloadProgress.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_installing', this._viewHandler_ocsManager_installing)
            .add('ocsManager_downloadProgress', this._viewHandler_ocsManager_downloadProgress);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_installing', this._viewHandler_ocsManager_installing)
            .remove('ocsManager_downloadProgress', this._viewHandler_ocsManager_downloadProgress);
    }

    render() {
        return `
            <style>
            ${this.sharedStyle}
            @import url(styles/material-icons.css);
            </style>

            <style>
            :host {
                display: flex;
                flex-flow: column nowrap;
                flex: 1 1 auto;
            }

            ul[data-container] {
                flex: 1 1 auto;
                list-style: none;
                overflow: auto;
            }
            ul[data-container] li {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                margin: 1em;
                padding: 1em 2em;
                border: 1px solid var(--color-border);
                border-radius: 5px;
            }
            ul[data-container] li:hover {
                border-color: rgba(0,0,0,0.3);
            }

            figure[data-previewpic] {
                flex: 0 0 auto;
                width: 64px;
                height: 64px;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: contain;
            }

            div[data-main] {
                flex: 1 1 auto;
                padding: 0 1em;
            }
            progress[data-progress] {
                display: inline-block;
                width: 100%;
                margin: 0.5em 0;
            }
            progress[data-progress][value="0"] {
                display: none;
            }

            nav[data-action] {
                flex: 0 0 auto;
            }
            nav[data-action] app-button[data-state="inactive"] {
                display: none;
            }
            </style>

            <ul data-container></ul>
        `;
    }

    _listItemHtml(state) {
        return `
            <li data-url="${state.metadata.url}">
            <figure data-previewpic>
            <i class="material-icons md-larger md-dark">cloud_download</i>
            </figure>
            <div data-main>
            <h4 data-name>${state.metadata.filename}</h4>
            <progress data-progress value="0" max="1"></progress>
            <p data-message>${state.message}</p>
            </div>
            <nav data-action>
            <!--<app-button data-action="" data-item-key="">Cancel</app-button>-->
            </nav>
            </li>
        `;
    }

    _viewHandler_ocsManager_installing(state) {
        const listItem = this.contentRoot.querySelector(`li[data-url="${state.metadata.url}"]`);
        if (listItem) {
            listItem.querySelector('p[data-message]').textContent = state.message;
            if (state.status === 'success_install') {
                listItem.querySelector('progress[data-progress]').value = '0';
            }
        }
        else {
            this.contentRoot.querySelector('ul[data-container]').insertAdjacentHTML('afterbegin', this._listItemHtml(state));
        }
    }

    _viewHandler_ocsManager_downloadProgress(state) {
        const listItem = this.contentRoot.querySelector(`li[data-url="${state.url}"]`);
        if (listItem) {
            listItem.querySelector('progress[data-progress]').value = '' + state.bytesReceived/state.bytesTotal;
            listItem.querySelector('p[data-message]').textContent = 'Downloading... '
                + Chilit.Utility.convertByteToHumanReadable(state.bytesReceived)
                + ' / '
                + Chilit.Utility.convertByteToHumanReadable(state.bytesTotal);
        }
    }

}
