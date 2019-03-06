import Chilit from '../../libs/chirit/Chirit.js';

import BaseComponent from './common/BaseComponent.js';

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
            <style>${this.sharedStyle}</style>

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
            progress[data-progress][value=""] {
                display: none;
            }

            nav[data-action] {
                flex: 0 0 auto;
            }
            nav[data-action] button {
                -webkit-appearance: none;
                appearance: none;
                display: inline-block;
                padding: 0.5em 1em;
                border: 1px solid var(--color-border);
                border-radius: 3px;
                background-color: var(--color-content);
                line-height: 1;
                outline: none;
                cursor: pointer;
            }
            nav[data-action] button:hover {
                border-color: rgba(0,0,0,0.3);
            }
            nav[data-action] button[data-status="inactive"] {
                display: none;
            }
            </style>

            <ul data-container></ul>
        `;
    }

    _listItemHtml(state) {
        return `
            <li data-url="${state.metadata.url}">
            <figure data-previewpic></figure>
            <div data-main>
            <span data-name>${state.metadata.filename}</span>
            <progress data-progress value="" max=""></progress>
            <span data-message>${state.message}</span>
            </div>
            <nav data-action>
            <!--<button data-action="" data-item-key="">Cancel</button>-->
            </nav>
            </li>
        `;
    }

    _viewHandler_ocsManager_installing(state) {
        const listItem = this.contentRoot.querySelector(`li[data-url="${state.metadata.url}"]`);
        if (listItem) {
            listItem.querySelector('span[data-message]').textContent = state.message;
        }
        else {
            this.contentRoot.querySelector('ul[data-container]')
                .insertAdjacentHTML('afterbegin', this._listItemHtml(state));
        }
    }

    _viewHandler_ocsManager_downloading(state) {
        const listItem = this.contentRoot.querySelector(`li[data-url="${state.url}"]`);
        if (listItem) {
            const progress = listItem.querySelector('progress[data-progress]');
            progress.value = '' + state.bytesReceived;
            progress.max = '' + state.bytesTotal;
            const message = 'Downloading... '
                + Chilit.Utility.convertByteToHumanReadable(state.bytesReceived)
                + ' / '
                + Chilit.Utility.convertByteToHumanReadable(state.bytesTotal);
            listItem.querySelector('span[data-message]').textContent = message;
        }
    }

}
