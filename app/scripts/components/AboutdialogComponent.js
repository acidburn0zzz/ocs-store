import BaseComponent from './BaseComponent.js';

export default class AboutdialogComponent extends BaseComponent {

    init() {
        this.state = {
            productName: '',
            version: '',
            description: '',
            author: '',
            license: '',
            homepage: '',
            repository: '',
            bugs: ''
        };

        this.contentRoot.addEventListener('click', this._handleClick.bind(this));

        this._viewHandler_general_about = this._viewHandler_general_about.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('general_about', this._viewHandler_general_about);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('general_about', this._viewHandler_general_about);
    }

    render() {
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

            <dialog-component data-min-width="500px" data-max-width="500px" data-header data-auto-close>
            <h3 slot="header">About This App</h3>
            <div slot="content">
            <h4 class="icon-ocs-store">${this.state.productName}</h4>
            <p>Version ${this.state.version}</p>
            <p>${this.state.description}</p>
            <p>
            Author: ${this.state.author}<br>
            License: ${this.state.license}
            </p>
            <p>
            Website: <a href="${this.state.homepage}">${this.state.homepage}</a><br>
            Project page: <a href="${this.state.repository}">${this.state.repository}</a><br>
            Report a bug: <a href="${this.state.bugs}">${this.state.bugs}</a>
            </p>
            </div>
            </dialog-component>
        `;
    }

    open() {
        this.contentRoot.querySelector('dialog-component').open();
    }

    close() {
        this.contentRoot.querySelector('dialog-component').close();
    }

    _handleClick(event) {
        if (event.target.closest('a')) {
            event.preventDefault();
            const anchorElement = event.target.closest('a');
            this.dispatch('webview_navigation', {
                action: 'load',
                url: anchorElement.href
            });
            this.close();
        }
    }

    _viewHandler_general_about(state) {
        this.update({...this.state, ...state});
        this.open();
    }

}
