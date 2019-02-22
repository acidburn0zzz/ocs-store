import BaseComponent from './BaseComponent.js';

export default class CollectionupdateComponent extends BaseComponent {

    init() {
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
            ul[data-container] li > div {
                flex: 1 1 auto;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
            }
            ul[data-container] li > div figure[data-previewpic] {
                display: inline-block;
                width: 64px;
                height: 64px;
                margin-right: 1em;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: contain;
            }
            ul[data-container] li > div > div {
                width: 100%;
            }
            ul[data-container] li > div > div span[data-name] {
                flex: 1 1 auto;
                display: inline-block;
            }
            ul[data-container] li > div > div progress[data-progress] {
                width: 70%;
            }
            ul[data-container] li > div > div progress[data-progress][value=""] {
                display: none;
            }
            ul[data-container] li nav[data-actions] {
                display: inline-block;
            }
            </style>

            <ul class="flex-auto" data-container></ul>
        `;
    }

    _listItemsHtml(updateAvailableItemsState) {
        const listItems = [];

        if (Object.keys(updateAvailableItemsState.updateAvailableItems).length) {
            for (const value of Object.values(updateAvailableItemsState.updateAvailableItems)) {
                const itemKey = value.installed_item;
                const file = updateAvailableItemsState.installedItems[itemKey].files[0];
                const previewpicUrl = `file://${updateAvailableItemsState.previewpicDirectory}/${this.convertItemKeyToPreviewpicFilename(itemKey)}`;
                listItems.push(`
                    <li class="widget">
                    <div>
                    <figure data-previewpic style="background-image: url('${previewpicUrl}');"></figure>
                    <div>
                    <span data-name>${file}</span><br>
                    <progress data-progress value="" max=""></progress>
                    <span data-progress></span>
                    </div>
                    </div>
                    <nav data-actions>
                    <button class="button-accept" data-action="update" data-item-key="${itemKey}">Update</button>
                    </nav>
                    </li>
                `);
            }
        }

        return listItems.join('');
    }

    _viewHandler_ocsManager_updateAvailableItems(state) {
        this.contentRoot.querySelector('ul[data-container]')
            .innerHTML = this._listItemsHtml(state);
    }

    _viewHandler_ocsManager_updating(state) {}

}
