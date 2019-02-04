import BaseComponent from './BaseComponent.js';

export default class RootComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <pageswitcher-component class="flex-auto flex-column">

            <page-component id="browser" slot="page" class="flex-auto flex-column">
            <toolbar-component slot="header"></toolbar-component>
            <webview-component slot="content" class="flex-auto flex-column"></webview-component>
            <statusbar-component slot="footer"></statusbar-component>
            </page-component>

            </pageswitcher-component>
        `;
    }

}
