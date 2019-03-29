import BaseComponent from './common/BaseComponent.js';

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
            <style>
            ${this.sharedStyle}
            </style>

            <style>
            app-page[slot="content"] {
                display: flex;
                flex-flow: column nowrap;
                flex: 1 1 auto;
            }
            app-switchview[slot="content"] {
                display: flex;
                flex-flow: column nowrap;
                flex: 1 1 auto;
            }
            </style>

            <app-dialog data-width="80%" data-height="80%" data-footer-state="inactive">
            <h3 slot="header">My Collection</h3>
            <app-page id="collection" slot="content">
            <app-collectionsidebar slot="sidebar"></app-collectionsidebar>
            <app-switchview slot="content">
            <app-collectioninstalled id="installed"></app-collectioninstalled>
            <app-collectionupdate id="update"></app-collectionupdate>
            <app-collectiondownload id="download"></app-collectiondownload>
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

    open(view = '') {
        if (view) {
            this._handleCollectionsidebarSelect({detail: {select: view}});
        }
        this.contentRoot.querySelector('app-dialog').open();
    }

    close() {
        this.contentRoot.querySelector('app-dialog').close();
    }

    _handleCollectionsidebarSelect(event) {
        const switchviewComponent = this.contentRoot.querySelector('app-switchview');
        switch (event.detail.select) {
            case 'installed': {
                switchviewComponent.switch('installed');
                break;
            }
            case 'update': {
                switchviewComponent.switch('update');
                break;
            }
            case 'download': {
                switchviewComponent.switch('download');
                break;
            }
        }
    }

    _viewHandler_ocsManager_activate(state) {
        this._isActivated = state.isActivated;
        this.dispatch('ocsManager_installedItems', {});
        this.dispatch('ocsManager_updateAvailableItems', {});
    }

}
