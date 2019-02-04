import BaseComponent from './BaseComponent.js';

export default class DialogComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return [
            'data-min-width', 'data-max-width',
            'data-min-height', 'data-max-height',
            'data-header', 'data-footer',
            'data-autoclose'
        ];
    }

    init() {
        this._containerElement = null;
    }

    render() {
        const minWidth = this.getAttribute('data-min-width') ? this.getAttribute('data-min-width') : 'auto';
        const maxWidth = this.getAttribute('data-max-width') ? this.getAttribute('data-max-width') : 'auto';
        const minHeight = this.getAttribute('data-min-height') ? this.getAttribute('data-min-height') : 'auto';
        const maxHeight = this.getAttribute('data-max-height') ? this.getAttribute('data-max-height') : 'auto';
        const header = this.hasAttribute('data-header') ? 'active' : 'inactive';
        const footer = this.hasAttribute('data-footer') ? 'active' : 'inactive';
        const autoclose = this.hasAttribute('data-autoclose') ? 'autoclose' : '';

        return `
            ${this.sharedStyle}

            <style>
            div[data-container] {
                z-index: 1000;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                align-items: center;
                justify-content: center;
            }
            div[data-container="inactive"] {
                display: none;
            }

            div[data-dialog] {
                min-width: ${minWidth};
                max-width: ${maxWidth};
                min-height: ${minHeight};
                max-height: ${maxHeight};
                background-color: var(--color-content);
                box-shadow: 0 10px 30px var(--color-shadow);
            }
            div[data-dialog] div[data-header] {
                align-items: center;
            }
            div[data-dialog] div[data-header="inactive"] {
                display: none;
            }
            div[data-dialog] div[data-footer="inactive"] {
                display: none;
            }
            </style>

            <div class="flex" data-container="inactive" data-action="${autoclose}">

            <div class="widget flex-column fade-in" data-dialog>
            <div class="widget-header flex" data-header="${header}">
            <div class="flex-auto"><slot name="header"></slot></div>
            <div><button-component data-icon="close" data-action="close"></button-component></div>
            </div>
            <div class="widget-content flex-auto" data-content><slot name="content"></slot></div>
            <div class="widget-footer" data-footer="${footer}"><slot name="footer"></slot></div>
            </div>

            </div>
        `;
    }

    componentUpdatedCallback() {
        this._containerElement = this.contentRoot.querySelector('div[data-container]');

        this._containerElement.addEventListener('click', (event) => {
            if (event.target.getAttribute('data-action') === 'autoclose') {
                this.close();
            }
            else if (event.target.closest('[data-action="close"]')) {
                this.close();
            }
        });
    }

    open() {
        this._containerElement.setAttribute('data-container', 'active');
        this.dispatch('dialog-open', {});
    }

    close() {
        this._containerElement.setAttribute('data-container', 'inactive');
        this.dispatch('dialog-close', {});
    }

}
