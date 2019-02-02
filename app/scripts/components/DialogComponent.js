import BaseComponent from './BaseComponent.js';

export default class DialogComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return ['data-autoclose', 'data-header', 'data-footer'];
    }

    render() {
        const close = this.hasAttribute('data-autoclose') ? 'close' : '';
        const header = this.hasAttribute('data-header') ? 'active' : 'inactive';
        const footer = this.hasAttribute('data-footer') ? 'active' : 'inactive';

        return `
            ${this.sharedStyle}

            <style>
            div[data-overlay] {
                z-index: 1000;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                align-items: center;
                justify-content: center;
            }
            div.widget {
                width: 500px;
                background-color: var(--color-content);
                box-shadow: 0 10px 30px var(--color-shadow);
            }
            div.widget div[data-header] {
                align-items: center;
            }
            div.widget div[data-header="inactive"] {
                display: none;
            }
            div.widget div[data-footer="inactive"] {
                display: none;
            }
            </style>

            <div class="flex" data-overlay data-action="${close}">

            <div class="widget fade-in">
            <div class="widget-header flex" data-header="${header}">
            <div class="flex-auto"><slot name="header"></slot></div>
            <div><button-component data-action="close" data-icon="close"></button-component></div>
            </div>
            <div class="widget-content"><slot name="content"></slot></div>
            <div class="widget-footer" data-footer="${footer}">
            <slot name="footer"></slot>
            </div>
            </div>

            </div>
        `;
    }

    componentUpdatedCallback() {
        const overlayElement = this.contentRoot.querySelector('div[data-overlay]');
        overlayElement.addEventListener('click', (event) => {
            if (event.target.closest('[data-action="close"]')) {
                this.close();
            }
        });
    }

    componentConnectedCallback() {
        this.dispatch('dialog-open', {});
    }

    componentDisconnectedCallback() {
        this.dispatch('dialog-close', {});
    }

    close() {
        this.parentNode.removeChild(this);
    }

}
