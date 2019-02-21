import BaseComponent from './BaseComponent.js';

export default class CollectiondownloadComponent extends BaseComponent {

    init() {
        this._viewHandler_ocsManager_install = this._viewHandler_ocsManager_install.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_install', this._viewHandler_ocsManager_install);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_install', this._viewHandler_ocsManager_install);
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
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                margin: 1em;
                padding: 1em;
            }
            </style>

            <ul class="flex-auto" data-container></ul>
        `;
    }

    _listItemHtml(downloadState) {
        return `
            <li class="widget" data-url="${downloadState.metadata.url}">
            <div>
            <span data-name>${downloadState.metadata.filename}</span>
            <span data-message>${downloadState.message}</span>
            </div>
            </li>
        `;
    }

    _viewHandler_ocsManager_install(state) {
        const downloadItem = this.contentRoot.querySelector(`li[data-url="${state.metadata.url}"]`);
        if (downloadItem) {
            downloadItem.querySelector('span[data-message]').textContent = state.message;
        }
        else {
            this.contentRoot.querySelector('ul[data-container]')
                .insertAdjacentHTML('afterbegin', this._listItemHtml(state));
        }
    }

}
