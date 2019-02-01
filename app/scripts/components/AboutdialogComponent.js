import BaseComponent from './BaseComponent.js';

export default class AboutdialogComponent extends BaseComponent {

    render() {
        const generalAboutState = this.rootState.get('general_about');

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

            <dialog-component>
            <h4 slot="title">About ${generalAboutState.productName}</h4>
            <div slot="content">
            <h4 class="icon-ocs-store">${generalAboutState.productName}</h4>
            <p>Version ${generalAboutState.version}</p>
            <p>${generalAboutState.description}</p>
            <p>
            Author: ${generalAboutState.author}<br>
            License: ${generalAboutState.license}
            </p>
            <p>
            Website: <a href="${generalAboutState.homepage}">${generalAboutState.homepage}</a><br>
            Project page: <a href="${generalAboutState.repository}">${generalAboutState.repository}</a><br>
            Report a bug: <a href="${generalAboutState.bugs}">${generalAboutState.bugs}</a>
            </p>
            </div>
            <button slot="control" class="button" data-action="close">OK</button>
            </dialog-component>
        `;
    }

    componentUpdatedCallback() {
        const dialogComponent = this.contentRoot.querySelector('dialog-component');

        dialogComponent.addEventListener('click', (event) => {
            if (event.target.closest('a')) {
                event.preventDefault();
                const anchorElement = event.target.closest('a');
                this.dispatch('webview_navigation', {
                    action: 'load',
                    url: anchorElement.href
                });
                dialogComponent.close();
            }
        });

        dialogComponent.addEventListener('dialog-close', () => {
            this.parentNode.removeChild(this);
        });
    }

}
