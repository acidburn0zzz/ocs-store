import BaseComponent from './BaseComponent.js';

export default class CollectiondialogComponent extends BaseComponent {

    init() {
        this._isActivated = false;

        this.contentRoot.addEventListener('collectionsidebar-select', this._handleCollectionsidebarSelect.bind(this));

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
                data-min-width="80%" data-max-width="80%"
                data-min-height="80%" data-max-height="80%"
                data-header data-autoclose>
            <h3 slot="header">My Collection</h3>
            <page-component id="collection" slot="content" class="flex-auto flex-column">
            <collectionsidebar-component slot="sidebar" class="flex-auto flex-column"></collectionsidebar-component>
            <switchview-component slot="content" class="flex-auto flex-column">
            <collectiondownload-component id="download" class="flex-auto flex-column"></collectiondownload-component>
            <collectionupdate-component id="update" class="flex-auto flex-column"></collectionupdate-component>
            <collectioninstalled-component id="installed" class="flex-auto flex-column"></collectioninstalled-component>
            </switchview-component>
            </page-component>
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

    _handleCollectionsidebarSelect(event) {
        const switchviewComponent = this.contentRoot.querySelector('switchview-component');
        switch (event.detail.select) {
            case 'download':
                switchviewComponent.switch('download');
                break;
            case 'update':
                switchviewComponent.switch('update');
                break;
            case 'installed':
                switchviewComponent.switch('installed');
                break;
        }
    }

    _viewHandler_ocsManager_activate(state) {
        this._isActivated = state.isActivated;
        this.dispatch('ocsManager_installedItems', {});
    }

}
