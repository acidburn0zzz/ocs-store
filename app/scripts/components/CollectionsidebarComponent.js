import BaseComponent from './BaseComponent.js';

export default class CollectionsidebarComponent extends BaseComponent {

    init() {
        this.contentRoot.addEventListener('click', this._handleClick.bind(this));

        this._viewHandler_ocsManager_installedItems = this._viewHandler_ocsManager_installedItems.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_installedItems', this._viewHandler_ocsManager_installedItems);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_installedItems', this._viewHandler_ocsManager_installedItems);
    }

    render() {
        return `
            ${this.sharedStyle}

            <style>
            :host {
                width: 200px;
            }
            nav {
                width: inherit;
                background-color: var(--color-widget);
            }
            nav ul.linklist li a {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                width: 100%;
                color: var(--color-text);
            }
            nav ul.linklist li a span[data-name] {
                flex: 1 1 auto;
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            nav ul.linklist li a span[data-count] {
                display: inline-block;
                padding: 0.3em 0.5em;
                border-radius: 1em;
                background-color: var(--color-active-secondary);
                line-height: 1;
            }
            nav ul.linklist li a[data-selected] {
                background-color: var(--color-active);
            }
            </style>

            <nav class="flex-auto">
            <ul class="linklist" data-menu="activity">
            <li>
            <a href="#" data-action="download">
            <span data-name>Download</span>
            <span data-count></span>
            </a>
            </li>
            <li>
            <a href="#" data-action="update">
            <span data-name>Update</span>
            <span data-count></span>
            </a>
            </li>
            </ul>
            <h4>Installed</h4>
            <ul class="linklist" data-menu="category"></ul>
            </nav>
        `;
    }

    _categoryMenuItemsHtml(installedItemsState) {
        const listItems = [];

        if (Object.keys(installedItemsState.installedItems).length) {
            const categorizedInstalledItems = {};
            for (const [key, value] of Object.entries(installedItemsState.installedItems)) {
                if (!categorizedInstalledItems[value.install_type]) {
                    categorizedInstalledItems[value.install_type] = {};
                }
                categorizedInstalledItems[value.install_type][key] = value;
            }
            for (const [key, value] of Object.entries(categorizedInstalledItems)) {
                listItems.push(`
                    <li>
                    <a href="#" data-action="installed" data-install-type="${key}">
                    <span data-name>${installedItemsState.installTypes[key].name}</span>
                    <span data-count>${Object.keys(value).length}</span>
                    </a>
                    </li>
                `);
            }
        }

        return listItems.join('');
    }

    _handleClick(event) {
        if (event.target.closest('a')) {
            event.preventDefault();
            const anchorElement = event.target.closest('a');
            const action = anchorElement.getAttribute('data-action');

            const sidebarElement = anchorElement.closest('nav');
            if (sidebarElement && action) {
                for (const menuItemElement of sidebarElement.querySelectorAll('a[data-action]')) {
                    menuItemElement.removeAttribute('data-selected');
                }
                anchorElement.setAttribute('data-selected', 'data-selected');
            }

            if (action === 'download') {
                this.dispatch('collectionsidebar-select', {select: 'download'});
            }
            else if (action === 'update') {
                this.dispatch('collectionsidebar-select', {select: 'update'});
            }
            else if (action === 'installed') {
                this.dispatch('ocsManager_installedItemsByType', {
                    installType: anchorElement.getAttribute('data-install-type')
                });
                this.dispatch('collectionsidebar-select', {select: 'installed'});
            }
        }
    }

    _viewHandler_ocsManager_installedItems(state) {
        this.contentRoot.querySelector('nav ul[data-menu="category"]')
            .innerHTML = this._categoryMenuItemsHtml(state);
    }

}
