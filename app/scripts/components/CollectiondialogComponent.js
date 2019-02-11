import BaseComponent from './BaseComponent.js';

export default class CollectiondialogComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <style>
            </style>

            <dialog-component data-min-width="80%" data-max-width="1000px" data-min-height="80%" data-max-height="800px" data-header data-autoclose>
            <h3 slot="header">My Collection</h3>
            <div slot="content"></div>
            </dialog-component>
        `;
    }

    open() {
        this.contentRoot.querySelector('dialog-component').open();
    }

    close() {
        this.contentRoot.querySelector('dialog-component').close();
    }

}
