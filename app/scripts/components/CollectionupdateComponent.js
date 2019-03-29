import BaseComponent from './common/BaseComponent.js';

export default class CollectionupdateComponent extends BaseComponent {

    init() {
        this.contentRoot.addEventListener('click', this._handleClick.bind(this));

        this._viewHandler_ocsManager_updateAvailableItems = this._viewHandler_ocsManager_updateAvailableItems.bind(this);
        this._viewHandler_ocsManager_updateProgress = this._viewHandler_ocsManager_updateProgress.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems)
            .add('ocsManager_updateProgress', this._viewHandler_ocsManager_updateProgress);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems)
            .remove('ocsManager_updateProgress', this._viewHandler_ocsManager_updateProgress);
    }

    render() {
        return `
            <style>
            ${this.sharedStyle}
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

    _listItemSetHtml(state) {
        let listItemSet = '';

        if (state.count) {
            for (const [key, value] of Object.entries(state.updateAvailableItems)) {
                const file = value.files[0];
                const previewpicUrl = `file://${state.previewpicDirectory}/${this.convertItemKeyToPreviewpicFilename(key)}`;
                listItemSet += `
                    <li data-item-key="${key}">
                    <figure data-previewpic style="background-image: url('${previewpicUrl}');"></figure>
                    <div data-main>
                    <h4 data-name>${file}</h4>
                    <progress data-progress value="0" max="1"></progress>
                    <p data-message></p>
                    </div>
                    <nav data-action>
                    <app-button data-action="ocsManager_update" data-item-key="${key}" data-state="active">Update</app-button>
                    </nav>
                    </li>
                `;
            }
        }

        return listItemSet;
    }

    _handleClick(event) {
        if (event.target.closest('app-button[data-action]')) {
            const target = event.target.closest('app-button[data-action]');
            switch (target.getAttribute('data-action')) {
                case 'ocsManager_update': {
                    this.dispatch('ocsManager_update', {itemKey: target.getAttribute('data-item-key')});
                    target.setAttribute('data-state', 'inactive');
                    break;
                }
            }
        }
    }

    _viewHandler_ocsManager_updateAvailableItems(state) {
        this.contentRoot.querySelector('ul[data-container]').innerHTML = this._listItemSetHtml(state);
    }

    _viewHandler_ocsManager_updateProgress(state) {
        const listItem = this.contentRoot.querySelector(`li[data-item-key="${state.itemKey}"]`);
        if (listItem) {
            listItem.querySelector('progress[data-progress]').value = '' + state.progress;
            listItem.querySelector('p[data-message]').textContent = `Updating... ${Math.ceil(state.progress * 100)}%`;
        }
    }

}
