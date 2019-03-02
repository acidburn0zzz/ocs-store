import BaseComponent from './BaseComponent.js';

export default class SplashscreenComponent extends BaseComponent {

    init() {
        this._viewHandler_webview_loading = this._viewHandler_webview_loading.bind(this);

        this.getStateManager().viewHandler
            .add('webview_loading', this._viewHandler_webview_loading);
    }

    render() {
        return `
            ${this.sharedStyle}

            <style>
            div[slot="content"] {
                align-items: center;
                justify-content: center;
            }
            div[slot="content"] h4 {
                padding-top: calc(96px + 1em);
                background-position: top center;
                background-repeat: no-repeat;
                background-size: 96px 96px;
            }
            </style>

            <app-dialog data-width="400px" data-height="300px" data-auto-open>
            <div slot="content" class="flex-auto flex-column">
            <h4 class="icon-ocs-store">Welcome to ${document.title}</h4>
            <p>Loading...</p>
            </div>
            </app-dialog>
        `;
    }

    _viewHandler_webview_loading(state) {
        if (!state.isLoading) {
            this.getStateManager().viewHandler
                .remove('webview_loading', this._viewHandler_webview_loading);
            this.contentRoot.querySelector('app-dialog').close();
            this.remove();
        }
    }

}
