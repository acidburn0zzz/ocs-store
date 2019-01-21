import BaseComponent from './BaseComponent.js';

export default class WebviewComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <webview></webview>
        `;
    }

}
