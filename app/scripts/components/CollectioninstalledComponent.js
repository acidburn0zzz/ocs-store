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
            <style>
            ${this.sharedStyle}
            </style>

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
            nav[data-action] app-button[data-state="inactive"] {
                display: none;
            }
            </style>

            <ul data-container></ul>
        `;
    }

    _listItemSetHtml(state) {
        let listItemSet = '';

        if (state.count) {
            const applyButtonState = state.isApplicableType ? 'active' : 'inactive';
            const openButtonText = (state.installType === 'bin') ? 'Run' : 'Open';
            const destination = state.installTypes[state.installType].destination;

            for (const [key, value] of Object.entries(state.installedItemsByType)) {
                const previewpicUrl = `file://${state.previewpicDirectory}/${this.convertItemKeyToPreviewpicFilename(key)}`;
                for (const file of value.files) {
                    const filePath = `${destination}/${file}`;
                    const fileUrl = `file://${filePath}`;
                    listItemSet += `
                        <li data-item-key="${key}">
                        <figure data-previewpic style="background-image: url('${previewpicUrl}');"></figure>
                        <div data-main>
                        <h4 data-name>${file}</h4>
                        </div>
                        <nav data-action>
                        <app-button data-action="ocsManager_applyTheme"
                            data-path="${filePath}" data-install-type="${state.installType}"
                            data-state="${applyButtonState}">Apply</app-button>
                        <app-button data-action="ocsManager_openUrl" data-url="${fileUrl}">${openButtonText}</app-button>
                        <app-button data-action="ocsManager_uninstall" data-item-key="${key}">Delete</app-button>
                        </nav>
                        </li>
                    `;
                }
            }
        }

        return listItemSet;
    }

    _disposableIndicator(target) {
        const indicator = document.createElement('app-indicator');
        target.appendChild(indicator);
        indicator.start();
        setTimeout(() => {
            indicator.stop();
            indicator.remove();
        }, 3000);
    }

    _handleClick(event) {
        if (event.target.closest('app-button[data-action]')) {
            const target = event.target.closest('app-button[data-action]');
            switch (target.getAttribute('data-action')) {
                case 'ocsManager_applyTheme': {
                    this._disposableIndicator(target);
                    this.dispatch('ocsManager_applyTheme', {
                        path: target.getAttribute('data-path'),
                        installType: target.getAttribute('data-install-type')
                    });
                    break;
                }
                case 'ocsManager_openUrl': {
                    this._disposableIndicator(target);
                    this.dispatch('ocsManager_openUrl', {url: target.getAttribute('data-url')});
                    break;
                }
                case 'ocsManager_uninstall': {
                    const itemKey = target.getAttribute('data-item-key');
                    this.dispatch('ocsManager_uninstall', {itemKey: itemKey});
                    for (const listItem of this.contentRoot.querySelectorAll(`li[data-item-key="${itemKey}"]`)) {
                        listItem.remove();
                    }
                    break;
                }
            }
        }
    }

    _viewHandler_ocsManager_installedItemsByType(state) {
        this.contentRoot.querySelector('ul[data-container]').innerHTML = this._listItemSetHtml(state);
    }

}
