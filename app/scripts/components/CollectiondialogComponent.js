import BaseComponent from './BaseComponent.js';

export default class CollectiondialogComponent extends BaseComponent {

    init() {
        this._isActivated = false;

        this.contentRoot.addEventListener('collectionsidebar_select', this._handleCollectionsidebarSelect.bind(this));

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

            <app-dialog data-width="80%" data-height="80%" data-header data-auto-close>
            <h3 slot="header">My Collection</h3>
            <app-page id="collection" slot="content" class="flex-auto flex-column">
            <app-collectionsidebar slot="sidebar" class="flex-auto flex-column"></app-collectionsidebar>
            <app-switchview slot="content" class="flex-auto flex-column">
            <app-collectiondownload id="download" class="flex-auto flex-column"></app-collectiondownload>
            <app-collectionupdate id="update" class="flex-auto flex-column"></app-collectionupdate>
            <app-collectioninstalled id="installed" class="flex-auto flex-column"></app-collectioninstalled>
            </app-switchview>
            </app-page>
            </app-dialog>
        `;
    }

    componentUpdatedCallback() {
        if (!this._isActivated) {
            this.dispatch('ocsManager_activate', {component: this});
        }
    }

    open() {
        this.contentRoot.querySelector('app-dialog').open();
    }

    close() {
        this.contentRoot.querySelector('app-dialog').close();
    }

    _handleCollectionsidebarSelect(event) {
        const switchviewComponent = this.contentRoot.querySelector('app-switchview');
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
        this.dispatch('ocsManager_updateAvailableItems', {});
    }

}
