import BaseComponent from './common/BaseComponent.js';

export default class CollectionupdateComponent extends BaseComponent {

    init() {
        this.contentRoot.addEventListener('click', this._handleClick.bind(this));

        this._viewHandler_ocsManager_updateAvailableItems = this._viewHandler_ocsManager_updateAvailableItems.bind(this);
        this._viewHandler_ocsManager_updating = this._viewHandler_ocsManager_updating.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems)
            .add('ocsManager_updating', this._viewHandler_ocsManager_updating);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems)
            .remove('ocsManager_updating', this._viewHandler_ocsManager_updating);
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

    _listItemsHtml(state) {
        const listItems = [];

        if (state.count) {
            for (const [key, value] of Object.entries(state.updateAvailableItems)) {
                const file = value.files[0];
                const previewpicUrl = `file://${state.previewpicDirectory}/${this.convertItemKeyToPreviewpicFilename(key)}`;
                listItems.push(`
                    <li data-item-key="${key}">
                    <figure data-previewpic style="background-image: url('${previewpicUrl}');"></figure>
                    <div data-main>
                    <span data-name>${file}</span><br>
                    <progress data-progress value="" max=""></progress>
                    </div>
                    <nav data-action>
                    <button data-action="ocsManager_update" data-item-key="${key}">Update</button>
                    </nav>
                    </li>
                `);
            }
        }

        return listItems.join('');
    }

    _handleClick(event) {
        if (event.target.closest('button[data-action]')) {
            const button = event.target.closest('button[data-action]');
            switch (button.getAttribute('data-action')) {
                case 'ocsManager_update':
                    this.dispatch('ocsManager_update', {itemKey: button.getAttribute('data-item-key')});
                    break;
            }
        }
    }

    _viewHandler_ocsManager_updateAvailableItems(state) {
        this.contentRoot.querySelector('ul[data-container]')
            .innerHTML = this._listItemsHtml(state);
    }

    _viewHandler_ocsManager_updating(state) {
        const listItem = this.contentRoot.querySelector(`li[data-item-key="${state.itemKey}"]`);
        if (listItem) {
            const progress = listItem.querySelector('progress[data-progress]');
            progress.value = '' + state.progress;
            progress.max = '' + 1;
        }
    }

}
