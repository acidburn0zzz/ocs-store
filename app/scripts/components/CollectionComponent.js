import BaseComponent from './BaseComponent.js';

export default class CollectionComponent extends BaseComponent {

    init() {
        this._isXdg = ['aix', 'freebsd', 'linux', 'openbsd', 'sunos'].includes(process.platform) ? true : false; // darwin, win32, android

        this.contentRoot.addEventListener('click', this._handleClick.bind(this));

        this._viewHandler_ocsManager_installedItems = this._viewHandler_ocsManager_installedItems.bind(this);
        this._viewHandler_ocsManager_installedItemsByType = this._viewHandler_ocsManager_installedItemsByType.bind(this);
        this._viewHandler_ocsManager_updateAvailableItems = this._viewHandler_ocsManager_updateAvailableItems.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_installedItems', this._viewHandler_ocsManager_installedItems)
            .add('ocsManager_installedItemsByType', this._viewHandler_ocsManager_installedItemsByType)
            .add('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_installedItems', this._viewHandler_ocsManager_installedItems)
            .remove('ocsManager_installedItemsByType', this._viewHandler_ocsManager_installedItemsByType)
            .remove('ocsManager_updateAvailableItems', this._viewHandler_ocsManager_updateAvailableItems);
    }

    render() {
        return `
            ${this.sharedStyle}

            <style>
            nav[data-sidebar] ul li[data-selected] {
                background-color: #ccc;
            }

            button[data-apply="inactive"] {}
            </style>

            <div class="flex">
            <nav data-sidebar>
            <ul class="linklist" data-menu="activity">
            <li><a href="#" data-action="downloadList"><span>Download</span><span data-count></span></a></li>
            <li><a href="#" data-action="updateList"><span>Update</span><span data-count></span></a></li>
            </ul>
            <ul class="linklist" data-menu="category"></ul>
            </nav>
            <switchview-component class="flex-auto">
            <ul id="installed"></ul>
            <ul id="download"></ul>
            <ul id="update"></ul>
            </switchview-component>
            </div>
        `;
    }

    _categoryListItemsHtml(installedItemsState) {
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
                    <a href="#" data-action="installedList" data-install-type="${key}">
                    <span>${installedItemsState.installTypes[key].name}</span>
                    <span data-count>${Object.keys(value).length}</span>
                    </a>
                    </li>
                `);
            }
        }

        return listItems.join('');
    }

    _installedListItemsHtml(installedItemsByTypeState) {
        const listItems = [];

        if (Object.keys(installedItemsByTypeState.installedItemsByType).length) {
            const apply = installedItemsByTypeState.isApplicableType ? 'active' : 'inactive';
            let destination = '';
            if (this._isXdg) {
                destination = installedItemsByTypeState.installTypes[installedItemsByTypeState.installType].destination;
            }
            else {
                destination = installedItemsByTypeState.installTypes[installedItemsByTypeState.installType].generic_destination;
            }
            for (const [key, value] of Object.entries(installedItemsByTypeState.installedItemsByType)) {
                const previewpicUrl = `file://${installedItemsByTypeState.previewpicDirectory}/${this._previewpicFilename(key)}`;
                for (const file of value.files) {
                    const path = `${destination}/${file}`;
                    const fileUrl = `file://${path}`;
                    listItems.push(`
                        <li>
                        <a href="${fileUrl}" target="_blank">
                        <figure style="background-image: url('${previewpicUrl}');"></figure>
                        <span>${file}</span>
                        </a>
                        <button class="button-accept"
                            data-action="apply"
                            data-path="${path}" data-install-type="${installedItemsByTypeState.installType}"
                            data-apply="${apply}">Apply</button>
                        <button class="button-warning" data-action="uninstall" data-item-key="${key}">Delete</button>
                        </li>
                    `);
                }
            }
        }

        return listItems.join('');
    }

    _previewpicFilename(itemKey) {
        // See also main.js
        return btoa(itemKey).slice(-255);
    }

    _handleClick(event) {
        if (event.target.closest('a')) {
            event.preventDefault();
            const anchorElement = event.target.closest('a');
            const action = anchorElement.getAttribute('data-action');
            if (action === 'installedList') {
                this.dispatch('ocsManager_installedItemsByType', {
                    installType: anchorElement.getAttribute('data-install-type')
                });
                this.contentRoot.querySelector('switchview-component').switch('installed');
            }
            else if (anchorElement.target === '_blank') {
                this.dispatch('ocsManager_externalUrl', {url: anchorElement.href});
            }
        }
        else if (event.target.closest('button')) {
            event.preventDefault();
            const buttonElement = event.target.closest('button');
            const action = buttonElement.getAttribute('data-action');
            if (action === 'apply') {
                this.dispatch('ocsManager_apply', {
                    path: buttonElement.getAttribute('data-path'),
                    installType: buttonElement.getAttribute('data-install-type')
                });
            }
            else if (action === 'uninstall') {
                this.dispatch('ocsManager_uninstall', {
                    itemKey: buttonElement.getAttribute('data-item-key')
                });
                buttonElement.closest('li').remove();
            }
        }
    }

    _viewHandler_ocsManager_installedItems(state) {
        this.contentRoot.querySelector('nav[data-sidebar] ul[data-menu="category"]')
            .innerHTML = this._categoryListItemsHtml(state);
    }

    _viewHandler_ocsManager_installedItemsByType(state) {
        this.contentRoot.querySelector('#installed')
            .innerHTML = this._installedListItemsHtml(state);
    }

    _viewHandler_ocsManager_updateAvailableItems(state) {
    }

}
