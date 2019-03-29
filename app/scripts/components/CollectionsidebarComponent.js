import BaseComponent from './common/BaseComponent.js';

export default class CollectionsidebarComponent extends BaseComponent {

    init() {
        this.contentRoot.addEventListener('click', this._handleClick.bind(this));

        this._viewHandler_ocsManager_installedItems = this._viewHandler_ocsManager_installedItems.bind(this);
        this._viewHandler_ocsManager_updateAvailableItems = this._viewHandler_ocsManager_updateAvailableItems.bind(this);
        this._viewHandler_ocsManager_metadataSet = this._viewHandler_ocsManager_metadataSet.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_installedItems', this._viewHandler_ocsManager_installedItems)
            .add('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems)
            .add('ocsManager_metadataSet', this._viewHandler_ocsManager_metadataSet);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_installedItems', this._viewHandler_ocsManager_installedItems)
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
                display: flex;
                flex-flow: column nowrap;
                flex: 1 1 auto;
                width: 200px;
            }

            nav[data-sidebar] {
                flex: 1 1 auto;
                width: inherit;
                border-right: 1px solid var(--color-border);
                background-color: var(--color-widget);
                overflow: auto;
            }
            nav[data-sidebar] h4 {
                padding: 0.5em 1em;
            }
            nav[data-sidebar] ul[data-menu="task"] {
                border-bottom: 1px solid var(--color-border);
            }
            nav[data-sidebar] ul li a {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                width: 100%;
                padding: 0.5em 1em;
                background-color: transparent;
                color: var(--color-text);
            }
            nav[data-sidebar] ul li a[data-selected] {
                background-color: var(--color-active);
            }
            nav[data-sidebar] ul li a[data-state="inactive"] {
                display: none;
            }
            nav[data-sidebar] ul li a span[data-name] {
                flex: 1 1 auto;
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                line-height: 1;
            }
            nav[data-sidebar] ul li a app-badge {
                flex: 0 0 auto;
            }
            nav[data-sidebar] ul li app-badge[data-count="0"] {
                display: none;
            }
            </style>

            <nav data-sidebar>
            <ul data-menu="task">
            <li>
            <a href="#" data-action="update" data-state="inactive">
            <span data-name>Update</span>
            <app-badge data-count="0" data-emphasis="high"></app-badge>
            </a>
            </li>
            <li>
            <a href="#" data-action="download" data-state="active">
            <span data-name>Download</span>
            <app-badge data-count="0" data-emphasis="medium"></app-badge>
            </a>
            </li>
            </ul>
            <h4>Installed</h4>
            <ul data-menu="categories"></ul>
            </nav>
        `;
    }

    _categoriesMenuItemSetHtml(state) {
        let listItemSet = '';

        if (state.count) {
            const categorizedItems = {};
            for (const [key, value] of Object.entries(state.installedItems)) {
                if (!categorizedItems[value.install_type]) {
                    categorizedItems[value.install_type] = {};
                }
                categorizedItems[value.install_type][key] = value;
            }

            const categories = [];
            for (const installType of Object.keys(categorizedItems)) {
                categories.push({
                    installType: installType,
                    name: state.installTypes[installType].name,
                    count: Object.keys(categorizedItems[installType]).length
                });
            }
            categories.sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA > nameB) {
                    return 1;
                }
                else if (nameA < nameB) {
                    return -1;
                }
                return 0;
            });

            for (const category of categories) {
                listItemSet += `
                    <li>
                    <a href="#" data-action="installed" data-install-type="${category.installType}">
                    <span data-name>${category.name}</span>
                    <app-badge data-count="${category.count}"></app-badge>
                    </a>
                    </li>
                `;
            }
        }

        return listItemSet;
    }

    _handleClick(event) {
        if (event.target.closest('a[data-action]')) {
            event.preventDefault();
            const target = event.target.closest('a[data-action]');

            if (this.contentRoot.querySelector('a[data-action][data-selected]')) {
                this.contentRoot.querySelector('a[data-action][data-selected]').removeAttribute('data-selected');
            }
            target.setAttribute('data-selected', 'data-selected');

            switch (target.getAttribute('data-action')) {
                case 'installed': {
                    this.dispatch('ocsManager_installedItemsByType', {installType: target.getAttribute('data-install-type')});
                    this.dispatch('collectionsidebar_select', {select: 'installed'});
                    break;
                }
                case 'update': {
                    this.dispatch('collectionsidebar_select', {select: 'update'});
                    break;
                }
                case 'download': {
                    this.dispatch('collectionsidebar_select', {select: 'download'});
                    break;
                }
            }
        }
    }

    _viewHandler_ocsManager_installedItems(state) {
        const categoriesMenu = this.contentRoot.querySelector('ul[data-menu="categories"]');

        const selectedMenuItem = categoriesMenu.querySelector('a[data-selected]');
        const installType = selectedMenuItem ? selectedMenuItem.getAttribute('data-install-type') : '';

        categoriesMenu.innerHTML = this._categoriesMenuItemSetHtml(state);

        const menuItem = installType ? categoriesMenu.querySelector(`a[data-install-type="${installType}"]`) : null;
        if (menuItem) {
            menuItem.click();
        }
    }

    _viewHandler_ocsManager_updateAvailableItems(state) {
        const menuItem = this.contentRoot.querySelector('a[data-action="update"]');
        menuItem.setAttribute('data-state', state.count ? 'active' : 'inactive');

        const badge = menuItem.querySelector('app-badge');
        badge.setAttribute('data-count', '' + state.count);
    }

    _viewHandler_ocsManager_metadataSet(state) {
        const menuItem = this.contentRoot.querySelector('a[data-action="download"]');
        //menuItem.setAttribute('data-state', state.count ? 'active' : 'inactive');

        const badge = menuItem.querySelector('app-badge');
        badge.setAttribute('data-count', '' + state.count);
    }

}
