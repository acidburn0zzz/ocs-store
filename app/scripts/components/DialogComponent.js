import BaseComponent from './BaseComponent.js';

export default class DialogComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return [
            'data-width', 'data-min-width', 'data-max-width',
            'data-height', 'data-min-height', 'data-max-height',
            'data-header', 'data-footer',
            'data-auto-open', 'data-auto-close'
        ];
    }

    init() {
        this.contentRoot.addEventListener('click', this._handleClick.bind(this));
    }

    render() {
        const width = this.getAttribute('data-width') ? this.getAttribute('data-width') : 'auto';
        const minWidth = this.getAttribute('data-min-width') ? this.getAttribute('data-min-width') : 'auto';
        const maxWidth = this.getAttribute('data-max-width') ? this.getAttribute('data-max-width') : 'auto';
        const height = this.getAttribute('data-height') ? this.getAttribute('data-height') : 'auto';
        const minHeight = this.getAttribute('data-min-height') ? this.getAttribute('data-min-height') : 'auto';
        const maxHeight = this.getAttribute('data-max-height') ? this.getAttribute('data-max-height') : 'auto';
        const header = this.hasAttribute('data-header') ? 'active' : 'inactive';
        const footer = this.hasAttribute('data-footer') ? 'active' : 'inactive';
        const autoOpen = this.hasAttribute('data-auto-open') ? 'active' : 'inactive';
        const autoClose = this.hasAttribute('data-auto-close') ? 'dialog_autoClose' : '';

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
                width: ${width};
                min-width: ${minWidth};
                max-width: ${maxWidth};
                height: ${height};
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

            <div class="flex" data-container="${autoOpen}" data-action="${autoClose}">

            <div class="widget flex-column fade-in" data-dialog>
            <div class="widget-header flex-fixed flex" data-header="${header}">
            <div class="flex-auto"><slot name="header"></slot></div>
            <div><button-component data-icon="close" data-action="dialog_close"></button-component></div>
            </div>
            <div class="flex-auto flex-column" data-content><slot name="content"></slot></div>
            <div class="widget-footer flex-fixed" data-footer="${footer}"><slot name="footer"></slot></div>
            </div>

            </div>
        `;
    }

    open() {
        this.contentRoot.querySelector('div[data-container]')
            .setAttribute('data-container', 'active');
        this.dispatch('dialog_open', {});
    }

    close() {
        this.contentRoot.querySelector('div[data-container]')
            .setAttribute('data-container', 'inactive');
        this.dispatch('dialog_close', {});
    }

    _handleClick(event) {
        if (event.target.getAttribute('data-action') === 'dialog_autoClose') {
            this.close();
        }
        else if (event.target.closest('[data-action="dialog_close"]')) {
            this.close();
        }
    }

}
