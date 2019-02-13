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
                    <a href="#" data-install-type="${key}">
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
        const installedItems = this.state.categorizedInstalledItems[this.state.installType];
        const list = [];
        if (installedItems && Object.keys(installedItems).length) {
            for (const [key, value] of Object.entries(installedItems)) {
                //const pic = getPic(value.url);
                for (const file of value.files) {
                    list.push(`
                        <li>
                        <a href="#" data-installed-item="${key}">${file}</a>
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
            if (anchorElement.getAttribute('data-install-type')) {
                this.dispatch(
                    'ocsManager_items',
                    {installType: anchorElement.getAttribute('data-install-type')}
                );
            }
        }
    }

    _viewHandler_ocsManager_items(state) {
        this.update({...this.state, ...state});
    }

}
