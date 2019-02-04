import BaseComponent from './BaseComponent.js';

export default class NavbuttonComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return ['disabled', 'data-type', 'data-action', 'data-icon'];
    }

    render() {
        const disabled = this.hasAttribute('disabled') ? 'disabled' : '';
        const icon = this.getAttribute('data-icon') || this.getAttribute('data-action') || '';

        return `
            ${this.sharedStyle}

            <style>
            :host {
                display: inline-block;
                width: 30px;
                height: 30px;
            }
            </style>

            <button-component data-icon="${icon}" ${disabled}></button-component>
        `;
    }

    componentUpdatedCallback() {
        if (!this.hasAttribute('disabled')
            && this.getAttribute('data-type')
            && this.getAttribute('data-action')
        ) {
            const buttonComponent = this.contentRoot.querySelector('button-component');
            buttonComponent.addEventListener('click', () => {
                this.dispatch(
                    this.getAttribute('data-type'),
                    {action: this.getAttribute('data-action')}
                );
            }, false);
        }
    }

}
