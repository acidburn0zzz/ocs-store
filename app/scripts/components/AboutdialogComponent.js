import BaseComponent from './common/BaseComponent.js';

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
        return this.html`
            <style>
            ${this.sharedStyle}
            @import url(images/icon.css);
            </style>

            <style>
            div[slot="content"] {
                padding: 1em;
                text-align: center;
            }
            div[slot="content"] figure.icon-ocs-store {
                display: inline-block;
                width: 128px;
                height: 128px;
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 128px 128px;
            }
            div[slot="content"] h4,
            div[slot="content"] p {
                margin: 0.5em 0;
            }
            </style>

            <app-dialog data-width="500px" data-footer-state="inactive">
            <h3 slot="header">About This App</h3>
            <div slot="content">
            <figure class="icon-ocs-store"></figure>
            <h4>${this.state.productName}</h4>
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
            </app-dialog>
        `;
    }

    open() {
        this.contentRoot.querySelector('app-dialog').open();
    }

    close() {
        this.contentRoot.querySelector('app-dialog').close();
    }

    _handleClick(event) {
        if (event.target.closest('a')) {
            event.preventDefault();
            this.dispatch('webview_loadUrl', {url: event.target.closest('a').href});
            this.close();
        }
    }

    _viewHandler_general_about(state) {
        this.update({...this.state, ...state});
        this.open();
    }

}
