import BaseComponent from './BaseComponent.js';

export default class CollectiondialogComponent extends BaseComponent {

    init() {
        this._isActivated = false;

        this._viewHandler_ocsManager_activate = this._viewHandler_ocsManager_activate.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_activate', this._viewHandler_ocsManager_activate);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_activate', this._viewHandler_ocsManager_activate);
    }

    render() {
        return `
            ${this.sharedStyle}

            <dialog-component
                data-min-width="80%" data-max-width="1000px"
                data-min-height="80%" data-max-height="800px"
                data-header data-autoclose>
            <h3 slot="header">My Collection</h3>
            <collection-component slot="content"></collection-component>
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
        this.dispatch('ocsManager_installedItems', {});
    }

}
