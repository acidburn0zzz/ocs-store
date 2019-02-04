import BaseComponent from './BaseComponent.js';

export default class AboutdialogComponent extends BaseComponent {

    init() {
        this.dialogComponent = null;
    }

    render() {
        const generalAboutState = this.rootState.get('general_about');
        const productName = generalAboutState.productName || '';
        const version = generalAboutState.version || '';
        const description = generalAboutState.description || '';
        const author = generalAboutState.author || '';
        const license = generalAboutState.license || '';
        const homepage = generalAboutState.homepage || '';
        const repository = generalAboutState.repository || '';
        const bugs = generalAboutState.bugs || '';

        return `
            ${this.sharedStyle}

            <style>
            div[slot="content"] {
                text-align: center;
            }
            div[slot="content"] h4 {
                padding-top: calc(96px + 1em);
                background-position: top center;
                background-repeat: no-repeat;
                background-size: 96px 96px;
            }
            </style>

            <dialog-component data-min-width="500px" data-max-width="500px" data-header data-autoclose>
            <h3 slot="header">About This App</h3>
            <div slot="content">
            <h4 class="icon-ocs-store">${productName}</h4>
            <p>Version ${version}</p>
            <p>${description}</p>
            <p>
            Author: ${author}<br>
            License: ${license}
            </p>
            <p>
            Website: <a href="${homepage}">${homepage}</a><br>
            Project page: <a href="${repository}">${repository}</a><br>
            Report a bug: <a href="${bugs}">${bugs}</a>
            </p>
            </div>
            </dialog-component>
        `;
    }

    componentUpdatedCallback() {
        this.dialogComponent = this.contentRoot.querySelector('dialog-component');

        this.dialogComponent.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                event.preventDefault();
                const anchorElement = event.target.closest('a');
                this.dispatch('webview_navigation', {
                    action: 'load',
                    url: anchorElement.href
                });
                this.close();
            }
        });
    }

    open() {
        this.dialogComponent.open();
    }

    close() {
        this.dialogComponent.close();
    }

}
