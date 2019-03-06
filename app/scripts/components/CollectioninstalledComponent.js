import BaseComponent from './common/BaseComponent.js';

export default class CollectioninstalledComponent extends BaseComponent {

    init() {
        this.contentRoot.addEventListener('click', this._handleClick.bind(this));

        this._viewHandler_ocsManager_installedItemsByType = this._viewHandler_ocsManager_installedItemsByType.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('ocsManager_installedItemsByType', this._viewHandler_ocsManager_installedItemsByType);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('ocsManager_installedItemsByType', this._viewHandler_ocsManager_installedItemsByType);
    }

    render() {
        return `
            <style>${this.sharedStyle}</style>

            <style>
            :host {
                display: flex;
                flex-flow: column nowrap;
                flex: 1 1 auto;
            }

            ul[data-container] {
                flex: 1 1 auto;
                list-style: none;
                overflow: auto;
            }
            ul[data-container] li {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                margin: 1em;
                padding: 1em 2em;
                border: 1px solid var(--color-border);
                border-radius: 5px;
            }
            ul[data-container] li:hover {
                border-color: rgba(0,0,0,0.3);
            }

            figure[data-previewpic] {
                flex: 0 0 auto;
                width: 64px;
                height: 64px;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: contain;
            }

            div[data-main] {
                flex: 1 1 auto;
                padding: 0 1em;
            }

            nav[data-action] {
                flex: 0 0 auto;
            }
            nav[data-action] button {
                -webkit-appearance: none;
                appearance: none;
                display: inline-block;
                padding: 0.5em 1em;
                border: 1px solid var(--color-border);
                border-radius: 3px;
                background-color: var(--color-content);
                line-height: 1;
                outline: none;
                cursor: pointer;
            }
            nav[data-action] button:hover {
                border-color: rgba(0,0,0,0.3);
            }
            nav[data-action] button[data-status="inactive"] {
                display: none;
            }
            </style>

            <ul data-container></ul>
        `;
    }

    _listItemsHtml(state) {
        const listItems = [];

        if (state.count) {
            const applyButtonStatus = state.isApplicableType ? 'active' : 'inactive';
            const openButtonText = (state.installType === 'bin') ? 'Run' : 'Open';
            const destination = state.installTypes[state.installType].destination;

            for (const [key, value] of Object.entries(state.installedItemsByType)) {
                const previewpicUrl = `file://${state.previewpicDirectory}/${this.convertItemKeyToPreviewpicFilename(key)}`;
                for (const file of value.files) {
                    const filePath = `${destination}/${file}`;
                    const fileUrl = `file://${filePath}`;
                    listItems.push(`
                        <li>
                        <figure data-previewpic style="background-image: url('${previewpicUrl}');"></figure>
                        <div data-main>
                        <span data-name>${file}</span>
                        </div>
                        <nav data-action>
                        <button data-action="ocsManager_openUrl" data-url="${fileUrl}">${openButtonText}</button>
                        <button data-action="ocsManager_applyTheme"
                            data-path="${filePath}" data-install-type="${state.installType}"
                            data-status="${applyButtonStatus}">Apply</button>
                        <button data-action="ocsManager_uninstall" data-item-key="${key}">Delete</button>
                        </nav>
                        </li>
                    `);
                }
            }
        }

        return listItems.join('');
    }

    _handleClick(event) {
        if (event.target.closest('button[data-action]')) {
            const button = event.target.closest('button[data-action]');
            switch (button.getAttribute('data-action')) {
                case 'ocsManager_openUrl':
                    this.dispatch('ocsManager_openUrl', {url: button.getAttribute('data-url')});
                    break;
                case 'ocsManager_applyTheme':
                    this.dispatch('ocsManager_applyTheme', {
                        path: button.getAttribute('data-path'),
                        installType: button.getAttribute('data-install-type')
                    });
                    break;
                case 'ocsManager_uninstall':
                    this.dispatch('ocsManager_uninstall', {itemKey: button.getAttribute('data-item-key')});
                    button.closest('li').remove();
                    break;
            }
        }
    }

    _viewHandler_ocsManager_installedItemsByType(state) {
        this.contentRoot.querySelector('ul[data-container]')
            .innerHTML = this._listItemsHtml(state);
    }

}
