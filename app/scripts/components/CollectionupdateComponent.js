import BaseComponent from './BaseComponent.js';

export default class CollectionupdateComponent extends BaseComponent {

    init() {
        this._viewHandler_ocsManager_updateAvailableItems = this._viewHandler_ocsManager_updateAvailableItems.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems);
    }

    render() {
        return `
            ${this.sharedStyle}
        `;
    }

    _viewHandler_ocsManager_updateAvailableItems(state) {
    }

}
