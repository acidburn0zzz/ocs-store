import BaseComponent from './BaseComponent.js';

export default class MenuComponent extends BaseComponent {

    static get componentObservedAttributes() {
        return [
            'data-width', 'data-min-width', 'data-max-width',
            'data-height', 'data-min-height', 'data-max-height',
            'data-offset-x', 'data-offset-y',
            'data-state', 'data-auto-close-state'
        ];
    }

    init() {
        this.contentRoot.addEventListener('click', this._handleClick.bind(this));
    }

    render() {
        const width = this.getAttribute('data-width') || 'auto';
        const minWidth = this.getAttribute('data-min-width') || 'auto';
        const maxWidth = this.getAttribute('data-max-width') || 'auto';

        const height = this.getAttribute('data-height') || 'auto';
        const minHeight = this.getAttribute('data-min-height') || 'auto';
        const maxHeight = this.getAttribute('data-max-height') || 'auto';

        const offsetX = this.getAttribute('data-offset-x') || '0';
        const offsetY = this.getAttribute('data-offset-y') || '0';

        const state = this.getAttribute('data-state') || 'inactive';
        const autoCloseState = this.getAttribute('data-auto-close-state') || 'active';

        const autoCloseAction = (autoCloseState === 'active') ? 'menu_autoClose' : '';

        return this.html`
            <style>
            ${this.sharedStyle}
            </style>

            <style>
            :host {
                display: inline-block;
                width: 0;
                height: 0;
            }

            nav[data-menu] {
                z-index: 1000;
                position: relative;
                top: ${offsetY};
                left: ${offsetX};
                width: ${width};
                min-width: ${minWidth};
                max-width: ${maxWidth};
                height: ${height};
                min-height: ${minHeight};
                max-height: ${maxHeight};
                padding: 3px 0;
                border: 1px solid var(--color-border);
                border-radius: 5px;
                box-shadow: 0 5px 20px 0 var(--color-shadow);
                background-color: var(--color-content);
            }
            nav[data-menu][data-state="inactive"] {
                display: none;
            }

            ::slotted(a) {
                display: block;
                padding: 0.5em 1em;
                background-color: transparent;
                color: var(--color-text);
                line-height: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            ::slotted(a:hover) {
                background-color: var(--color-active);
                color: var(--color-text);
            }

            ::slotted(hr) {
                border: 0;
                border-top: 1px solid var(--color-border);
            }

            div[data-overlay] {
                z-index: 999;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            div[data-overlay][data-state="inactive"] {
                display: none;
            }
            </style>

            <nav data-menu data-state="${state}" class="fade-in">
            <slot name="menuitem"></slot>
            </nav>

            <div data-overlay data-state="${state}" data-action="${autoCloseAction}"></div>
        `;
    }

    open() {
        this.contentRoot.querySelector('nav[data-menu]').setAttribute('data-state', 'active');
        this.contentRoot.querySelector('div[data-overlay]').setAttribute('data-state', 'active');
        this.dispatch('menu_open', {});
    }

    close() {
        this.contentRoot.querySelector('nav[data-menu]').setAttribute('data-state', 'inactive');
        this.contentRoot.querySelector('div[data-overlay]').setAttribute('data-state', 'inactive');
        this.dispatch('menu_close', {});
    }

    _handleClick(event) {
        if (event.target.getAttribute('data-action') === 'menu_autoClose'
            || event.target.closest('[data-action="menu_close"]')
        ) {
            this.close();
        }
    }

}
