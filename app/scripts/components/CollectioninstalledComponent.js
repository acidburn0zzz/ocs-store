import BaseComponent from './BaseComponent.js';

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
            ${this.sharedStyle}

            <style>
            ul[data-container] {
                list-style: none;
                margin: 0;
                overflow: auto;
            }
            ul[data-container] li {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                margin: 1em;
                padding: 1em;
            }
            ul[data-container] li a {
                flex: 1 1 auto;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                color: var(--color-text);
            }
            ul[data-container] li a figure[data-previewpic] {
                display: inline-block;
                width: 64px;
                height: 64px;
                margin-right: 1em;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: contain;
            }
            ul[data-container] li a span[data-name] {
                flex: 1 1 auto;
                display: inline-block;
            }
            ul[data-container] li nav[data-actions] {
                display: inline-block;
            }

            ul[data-container] button[data-apply="inactive"] {
                display: none;
            }
            </style>

            <ul class="flex-auto" data-container></ul>
        `;
    }

    _listItemsHtml(installedItemsByTypeState) {
        const listItems = [];

        if (Object.keys(installedItemsByTypeState.installedItemsByType).length) {
            const apply = installedItemsByTypeState.isApplicableType ? 'active' : 'inactive';
            const destinationKey = this.isXdg() ? 'destination' : 'generic_destination';
            const destination = installedItemsByTypeState.installTypes[installedItemsByTypeState.installType][destinationKey];
            for (const [key, value] of Object.entries(installedItemsByTypeState.installedItemsByType)) {
                const previewpicUrl = `file://${installedItemsByTypeState.previewpicDirectory}/${this.convertItemKeyToPreviewpicFilename(key)}`;
                for (const file of value.files) {
                    const path = `${destination}/${file}`;
                    const fileUrl = `file://${path}`;
                    listItems.push(`
                        <li class="widget">
                        <a href="${fileUrl}" target="_blank">
                        <figure data-previewpic style="background-image: url('${previewpicUrl}');"></figure>
                        <span data-name>${file}</span>
                        </a>
                        <nav data-actions>
                        <button class="button-accept"
                            data-action="apply"
                            data-path="${path}" data-install-type="${installedItemsByTypeState.installType}"
                            data-apply="${apply}">Apply</button>
                        <button class="button-warning" data-action="uninstall" data-item-key="${key}">Delete</button>
                        </nav>
                        </li>
                    `);
                }
            }
        }

        return listItems.join('');
    }

    _handleClick(event) {
        if (event.target.closest('a')) {
            event.preventDefault();
            const anchorElement = event.target.closest('a');
            if (anchorElement.target === '_blank') {
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

    _viewHandler_ocsManager_installedItemsByType(state) {
        this.contentRoot.querySelector('ul[data-container]')
            .innerHTML = this._listItemsHtml(state);
    }

}
