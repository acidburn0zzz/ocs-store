import BaseComponent from './BaseComponent.js';

export default class CollectiondialogComponent extends BaseComponent {

    init() {
        this._dialogComponent = null;
    }

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

    componentUpdatedCallback() {
        this._dialogComponent = this.contentRoot.querySelector('dialog-component');

        //this._dialogComponent.addEventListener('click', (event) => {
        //});
    }

    open() {
        this._dialogComponent.open();
    }

    close() {
        this._dialogComponent.close();
    }

}
