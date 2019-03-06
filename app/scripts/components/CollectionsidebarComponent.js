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
            <style>${this.sharedStyle}</style>

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
            nav[data-sidebar] ul[data-menu="activity"] {
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
            nav[data-sidebar] ul li a[data-status="inactive"] {
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
            nav[data-sidebar] ul li a span[data-count] {
                display: inline-block;
                padding: 4px 6px;
                border-radius: 10px;
                background-color: var(--color-active-secondary);
                font-size: 10px;
                line-height: 1;
            }

            nav[data-sidebar] ul li a[data-action="update"] span[data-count] {
                background-color: var(--color-important);
                color: var(--color-content);
            }
            nav[data-sidebar] ul li a[data-action="update"] span[data-count="0"] {
                display: none;
            }
            nav[data-sidebar] ul li a[data-action="download"] span[data-count] {
                background-color: var(--color-information);
                color: var(--color-content);
            }
            nav[data-sidebar] ul li a[data-action="download"] span[data-count="0"] {
                display: none;
            }
            </style>

            <nav data-sidebar>
            <ul data-menu="activity">
            <li>
            <a href="#" data-action="update" data-status="inactive">
            <span data-name>Update</span>
            <span data-count="0">0</span>
            </a>
            </li>
            <li>
            <a href="#" data-action="download" data-status="active">
            <span data-name>Download</span>
            <span data-count="0">0</span>
            </a>
            </li>
            </ul>
            <h4>Installed</h4>
            <ul data-menu="category"></ul>
            </nav>
        `;
    }

    _categoryMenuItemsHtml(state) {
        const menuItems = [];

        if (state.count) {
            const categorizedInstalledItems = {};
            for (const [key, value] of Object.entries(state.installedItems)) {
                if (!categorizedInstalledItems[value.install_type]) {
                    categorizedInstalledItems[value.install_type] = {};
                }
                categorizedInstalledItems[value.install_type][key] = value;
            }

            const categories = [];
            for (const installType of Object.keys(categorizedInstalledItems)) {
                categories.push({
                    installType: installType,
                    name: state.installTypes[installType].name,
                    count: Object.keys(categorizedInstalledItems[installType]).length
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
                menuItems.push(`
                    <li>
                    <a href="#" data-action="installed" data-install-type="${category.installType}">
                    <span data-name>${category.name}</span>
                    <span data-count="${category.count}">${category.count}</span>
                    </a>
                    </li>
                `);
            }
        }

        return menuItems.join('');
    }

    _handleClick(event) {
        if (event.target.closest('a[data-action]')) {
            event.preventDefault();
            const targetMenuItem = event.target.closest('a[data-action]');

            for (const menuItem of this.contentRoot.querySelectorAll('a[data-action]')) {
                menuItem.removeAttribute('data-selected');
            }
            targetMenuItem.setAttribute('data-selected', 'data-selected');

            switch (targetMenuItem.getAttribute('data-action')) {
                case 'installed':
                    this.dispatch('ocsManager_installedItemsByType', {
                        installType: targetMenuItem.getAttribute('data-install-type')
                    });
                    this.dispatch('collectionsidebar_select', {select: 'installed'});
                    break;
                case 'update':
                    this.dispatch('collectionsidebar_select', {select: 'update'});
                    break;
                case 'download':
                    this.dispatch('collectionsidebar_select', {select: 'download'});
                    break;
            }
        }
    }

    _viewHandler_ocsManager_installedItems(state) {
        this.contentRoot.querySelector('nav ul[data-menu="category"]')
            .innerHTML = this._categoryMenuItemsHtml(state);
    }

    _viewHandler_ocsManager_updateAvailableItems(state) {
        const menuItem = this.contentRoot.querySelector('a[data-action="update"]');
        menuItem.setAttribute('data-status', state.count ? 'active' : 'inactive');

        const badge = menuItem.querySelector('span[data-count]');
        badge.setAttribute('data-count', '' + state.count);
        badge.textContent = '' + state.count;
    }

    _viewHandler_ocsManager_metadataSet(state) {
        const menuItem = this.contentRoot.querySelector('a[data-action="download"]');
        //menuItem.setAttribute('data-status', state.count ? 'active' : 'inactive');

        const badge = menuItem.querySelector('span[data-count]');
        badge.setAttribute('data-count', '' + state.count);
        badge.textContent = '' + state.count;
    }

}
