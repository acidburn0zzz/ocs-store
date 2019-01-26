import BaseComponent from './BaseComponent.js';

export default class MenubuttonComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <style>
            :host {
                display: inline-block;
                width: 30px;
                height: 30px;
            }
            </style>

            <button-component data-icon="menu"></button-component>
        `;
    }

    componentUpdatedCallback() {
        const buttonComponent = this.contentRoot.querySelector('button-component');
        buttonComponent.addEventListener('click', () => {
        }, false);
    }

}
