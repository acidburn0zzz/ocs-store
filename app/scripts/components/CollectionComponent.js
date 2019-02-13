import BaseComponent from './BaseComponent.js';

export default class CollectionComponent extends BaseComponent {

    init() {
        this.state = {
            installType: '',
            isApplicableType: false,
            categorizedInstalledItems: {},
            installTypes: {},
            installedItems: {},
            updateAvailableItems: {}
        };

        this.contentRoot.addEventListener('click', this._handleClick.bind(this));

        this._viewHandler_ocsManager_items = this._viewHandler_ocsManager_items.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_items', this._viewHandler_ocsManager_items);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_items', this._viewHandler_ocsManager_items);
    }

    render() {
        return `
            ${this.sharedStyle}

            <style>
            nav ul li[data-current="yes"] {}

            button[data-apply="inactive"] {}
            </style>

            <div class="flex">
            <nav>${this._createCategoryList()}</nav>
            <div class="flex-auto">${this._createItemList()}</div>
            </div>
        `;

    }

    _createCategoryList() {
        const list = [];

        if (Object.keys(this.state.categorizedInstalledItems).length) {
            for (const [key, value] of Object.entries(this.state.categorizedInstalledItems)) {
                const current = (key === this.state.installType) ? 'yes' : 'no';
                list.push(`
                    <li data-current="${current}">
                    <a href="#" data-action="items" data-install-type="${key}">
                    <span>${this.state.installTypes[key].name}</span>
                    <span>${Object.keys(value).length}</span>
                    </a>
                    </li>
                `);
            }
        }

        return `<ul class="linklist">${list.join('')}</ul>`;
    }

    _createItemList() {
        const list = [];
        const installedItems = this.state.categorizedInstalledItems[this.state.installType];

        if (installedItems && Object.keys(installedItems).length) {
            const apply = this.state.isApplicableType ? 'active' : 'inactive';
            let destination = '';

            if (['aix', 'freebsd', 'linux', 'openbsd', 'sunos'].includes(process.platform )) {
                destination = this.state.installTypes[this.state.installType].destination;
            }
            else {
                // darwin, win32, android
                destination = this.state.installTypes[this.state.installType].generic_destination;
            }

            for (const [key, value] of Object.entries(installedItems)) {
                //const previewPicUrl = this._picUrl(value.url);
                const previewPicUrl = '';
                for (const file of value.files) {
                    const path = `${destination}/${file}`;
                    const fileUrl = `file://${path}`;
                    list.push(`
                        <li>
                        <a href="${fileUrl}" target="_blank">
                        <figure style="background-image: url(${previewPicUrl});"></figure>
                        <span>${file}</span>
                        </a>
                        <button class="button-accept"
                            name="apply"
                            data-path="${path}" data-install-type="${this.state.installType}"
                            data-apply="${apply}">Apply</button>
                        <button class="button-warning" name="uninstall" data-item-key="${key}">Delete</button>
                        </li>
                    `);
                }
            }
        }

        return `<ul>${list.join('')}</ul>`;
    }

    _handleClick(event) {
        if (event.target.closest('a')) {
            event.preventDefault();
            const anchorElement = event.target.closest('a');
            const action = anchorElement.getAttribute('data-action');
            if (action === 'items') {
                this.dispatch('ocsManager_items', {
                    installType: anchorElement.getAttribute('data-install-type')
                });
            }
            else if (anchorElement.target === '_blank') {
                this.dispatch('ocsManager_externalUrl', {url: anchorElement.href});
            }
        }
        else if (event.target.closest('button')) {
            event.preventDefault();
            const buttonElement = event.target.closest('button');
            if (buttonElement.name === 'apply') {
                this.dispatch('ocsManager_apply', {
                    path: buttonElement.getAttribute('data-path'),
                    installType: buttonElement.getAttribute('data-install-type')
                });
            }
            else if (buttonElement.name === 'uninstall') {
                this.dispatch('ocsManager_uninstall', {
                    itemKey: buttonElement.getAttribute('data-item-key')
                });
            }
        }
    }

    _viewHandler_ocsManager_items(state) {
        this.update({...this.state, ...state});
    }

}
