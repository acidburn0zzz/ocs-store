import BaseComponent from './common/BaseComponent.js';

export default class ToolbarComponent extends BaseComponent {

    init() {
        this.contentRoot.addEventListener('click', this._handleClick.bind(this));

        this._viewHandler_browserView_loading = this._viewHandler_browserView_loading.bind(this);
        this._viewHandler_browserView_page = this._viewHandler_browserView_page.bind(this);
        this._viewHandler_ocsManager_updateAvailableItems = this._viewHandler_ocsManager_updateAvailableItems.bind(this);
        this._viewHandler_ocsManager_metadataSet = this._viewHandler_ocsManager_metadataSet.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('browserView_loading', this._viewHandler_browserView_loading)
            .add('browserView_page', this._viewHandler_browserView_page)
            .add('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems)
            .add('ocsManager_metadataSet', this._viewHandler_ocsManager_metadataSet);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('browserView_loading', this._viewHandler_browserView_loading)
            .remove('browserView_page', this._viewHandler_browserView_page)
            .remove('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems)
            .remove('ocsManager_metadataSet', this._viewHandler_ocsManager_metadataSet);
    }

    render() {
        return `
            <style>
            ${this.sharedStyle}
            </style>

            <style>
            :host {
                height: 40px;
            }

            nav[data-toolbar] {
                height: inherit;
                border-bottom: 1px solid var(--color-border);
                background-color: var(--color-widget);
            }
            nav[data-toolbar] ul {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                height: inherit;
                margin: 0 4px;
            }
            nav[data-toolbar] ul li {
                flex: 0 0 auto;
                height: 30px;
                margin: 0 2px;
            }
            nav[data-toolbar] ul li[data-omnibox] {
                display: flex;
                flex-flow: row nowrap;
                flex: 1 1 auto;
                justify-content: center;
            }
            @media (min-width: 900px) {
                nav[data-toolbar] ul li[data-omnibox] {
                    margin-right: calc(32px * 4);
                }
            }

            app-iconbutton[data-action="browserView_reload"][data-state="inactive"] {
                display: none;
            }
            app-iconbutton[data-action="browserView_stop"][data-state="inactive"] {
                display: none;
            }

            app-menu a[slot="menuitem"],
            app-menu a[slot="menuitem"]:hover {
                color: var(--color-text);
            }

            nav[data-toolbar] ul li app-badge {
                z-index: 1;
                position: relative;
                top: -36px;
                left: 22px;
            }
            nav[data-toolbar] ul li app-badge[data-count="0"] {
                display: none;
            }
            nav[data-toolbar] ul li app-badge[data-emphasis="high"] {
                z-index: 2;
            }
            nav[data-toolbar] ul li app-badge[data-emphasis="medium"] {
                z-index: 3;
            }
            </style>

            <nav data-toolbar>
            <ul>
            <li>
            <app-iconbutton data-action="browserView_goBack"
                data-title="Back" data-icon="arrow_back" data-state="inactive"></app-iconbutton>
            </li>
            <li>
            <app-iconbutton data-action="browserView_goForward"
                data-title="Forward" data-icon="arrow_forward" data-state="inactive"></app-iconbutton>
            </li>
            <li>
            <app-iconbutton data-action="browserView_reload"
                data-title="Reload" data-icon="refresh" data-state="active"></app-iconbutton>
            <app-iconbutton data-action="browserView_stop"
                data-title="Stop" data-icon="close" data-state="inactive"></app-iconbutton>
            </li>
            <li>
            <app-iconbutton data-action="browserView_startPage"
                data-title="Startpage" data-icon="home"></app-iconbutton>
            </li>
            <li>
            <app-iconbutton data-action="ocsManager_collection"
                data-title="My Collection" data-icon="folder"></app-iconbutton><br>
            <app-badge data-count="0" data-emphasis="high"></app-badge>
            <app-badge data-count="0" data-emphasis="medium"></app-badge>
            </li>
            <li data-omnibox><app-omnibox></app-omnibox></li>
            <li>
            <app-iconbutton data-action="menu_open"
                data-title="Other Operations..." data-icon="more_vert"></app-iconbutton><br>
            <app-menu data-width="250px" data-offset-x="-220px">
            <a slot="menuitem" href="#" data-action="browserView_appBugsPage">Report a Bug</a>
            <a slot="menuitem" href="#" data-action="general_about">About This App</a>
            </app-menu>
            </li>
            </ul>
            </nav>
        `;
    }

    _handleClick(event) {
        let target = null;
        if (event.target.closest('app-iconbutton[data-action]')) {
            target = event.target.closest('app-iconbutton[data-action]');
        }
        else if (event.target.closest('a[slot="menuitem"][data-action]')) {
            event.preventDefault();
            target = event.target.closest('a[slot="menuitem"][data-action]');
        }
        else {
            return;
        }

        switch (target.getAttribute('data-action')) {
            case 'browserView_goBack': {
                this.dispatch('browserView_goBack', {});
                break;
            }
            case 'browserView_goForward': {
                this.dispatch('browserView_goForward', {});
                break;
            }
            case 'browserView_reload': {
                this.dispatch('browserView_reload', {});
                break;
            }
            case 'browserView_stop': {
                this.dispatch('browserView_stop', {});
                break;
            }
            case 'browserView_startPage': {
                this.dispatch('browserView_startPage', {});
                break;
            }
            case 'ocsManager_collection': {
                this.dispatch('ocsManager_collection', {});
                break;
            }
            case 'menu_open': {
                this.contentRoot.querySelector('app-menu').open();
                break;
            }
            case 'browserView_appBugsPage': {
                this.dispatch('browserView_appBugsPage', {});
                this.contentRoot.querySelector('app-menu').close();
                break;
            }
            case 'general_about': {
                this.dispatch('general_about', {});
                this.contentRoot.querySelector('app-menu').close();
                break;
            }
        }
    }

    _viewHandler_browserView_loading(state) {
        this.contentRoot.querySelector('app-iconbutton[data-action="browserView_reload"]')
            .setAttribute('data-state', state.isLoading ? 'inactive' : 'active');
        this.contentRoot.querySelector('app-iconbutton[data-action="browserView_stop"]')
            .setAttribute('data-state', state.isLoading ? 'active' : 'inactive');
    }

    _viewHandler_browserView_page(state) {
        this.contentRoot.querySelector('app-iconbutton[data-action="browserView_goBack"]')
            .setAttribute('data-state', state.canGoBack ? 'active' : 'inactive');
        this.contentRoot.querySelector('app-iconbutton[data-action="browserView_goForward"]')
            .setAttribute('data-state', state.canGoForward ? 'active' : 'inactive');
    }

    _viewHandler_ocsManager_updateAvailableItems(state) {
        const badge = this.contentRoot.querySelector('app-badge[data-emphasis="high"]');
        badge.setAttribute('data-count', '' + state.count);
    }

    _viewHandler_ocsManager_metadataSet(state) {
        const badge = this.contentRoot.querySelector('app-badge[data-emphasis="medium"]');
        badge.setAttribute('data-count', '' + state.count);
    }

}
