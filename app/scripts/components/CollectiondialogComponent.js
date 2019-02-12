import BaseComponent from './BaseComponent.js';

export default class CollectiondialogComponent extends BaseComponent {

    init() {
        this.state = {
            installType: '',
            isApplicableType: false,
            categorizedInstalledItems: {},
            installTypes: {},
            installedItems: {},
            updateAvailableItems: {}
        };

        this._isActivated = false;

        this._viewHandler_ocsManager_activate = this._viewHandler_ocsManager_activate.bind(this);
        this._viewHandler_ocsManager_items = this._viewHandler_ocsManager_items.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_activate', this._viewHandler_ocsManager_activate)
            .add('ocsManager_items', this._viewHandler_ocsManager_items);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_activate', this._viewHandler_ocsManager_activate)
            .remove('ocsManager_items', this._viewHandler_ocsManager_items);
    }

    render() {
        return `
            ${this.sharedStyle}

            <style>
            </style>

            <dialog-component data-min-width="80%" data-max-width="1000px" data-min-height="80%" data-max-height="800px" data-header data-autoclose>
            <h3 slot="header">My Collection</h3>
            <div slot="content"></div>
            </dialog-component>
        `;
    }

    componentUpdatedCallback() {
        if (!this._isActivated) {
            this.dispatch('ocsManager_activate', {component: this});
        }
    }

    open() {
        this.contentRoot.querySelector('dialog-component').open();
    }

    close() {
        this.contentRoot.querySelector('dialog-component').close();
    }

    _viewHandler_ocsManager_activate(state) {
        this._isActivated = state.isActivated;
        this.dispatch('ocsManager_items', {});
    }

    _viewHandler_ocsManager_items(state) {
        this.update({...this.state, ...state});
    }

}
