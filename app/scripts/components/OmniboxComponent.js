import BaseComponent from './BaseComponent.js';

export default class OmniboxComponent extends BaseComponent {

    init() {
        this.state = {
            url: '',
            title: '',
            startPage: ''
        };

        this.contentRoot.addEventListener('click', this._handleClick.bind(this));

        this._viewHandler_webview_page = this._viewHandler_webview_page.bind(this);
    }

    componentConnectedCallback() {
        this.getStateManager().viewHandler
            .add('webview_page', this._viewHandler_webview_page);
    }

    componentDisconnectedCallback() {
        this.getStateManager().viewHandler
            .remove('webview_page', this._viewHandler_webview_page);
    }

    render() {
        return `
            ${this.sharedStyle}

            <style>
            :host {
                display: inline-block;
                width: 500px;
                height: 30px;
            }

            div[data-omnibox] {
                width: inherit;
                height: inherit;
            }
            div[data-omnibox] button.button {
                box-shadow: none;
                width: inherit;
                height: inherit;
                border: 0;
                background-color: var(--color-active-secondary);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                transition: background-color 0.2s ease-out;
            }
            div[data-omnibox] button.button:hover {
                border: 0;
                background-color: var(--color-active);
            }

            div[data-palette] {
                z-index: 1000;
                position: relative;
                top: 0;
                left: 0;
                width: inherit;
                background-color: var(--color-content);
                box-shadow: 0 10px 30px var(--color-shadow);
            }
            div[data-palette] a[target="_blank"] {
                display: inline-block;
                padding-right: 18px;
                background-position: center right;
                background-repeat: no-repeat;
                background-size: 16px 16px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            div[data-palette] div.widget-content {
                margin: 1em 0;
            }
            div[data-palette] h4 {
                padding-top: 24px;
                background-position: top center;
                background-repeat: no-repeat;
                background-size: 24px 24px;
                color: var(--color-text-secondary);
                font-weight: normal;
                text-align: center;
            }
            div[data-palette] ul {
                list-style: none;
                margin: 0;
                flex-wrap: wrap;
                justify-content: center;
            }
            div[data-palette] ul li {
                width: 50%;
                padding: 5px;
            }
            div[data-palette] ul li button.button {
                box-shadow: none;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            div[data-palette] ul li button.button[name="startPage"][value="${this.state.startPage}"] {
                border-color: var(--color-information);
            }
            div[data-palette="inactive"] {
                display: none;
            }

            div[data-toggler] {
                z-index: 999;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            div[data-toggler="inactive"] {
                display: none;
            }
            </style>

            <div data-omnibox="active">
            <button class="button">${this.state.title}</button>
            </div>

            <div class="widget fade-in" data-palette="inactive">
            <div class="widget-header">
            <a href="${this.state.url}" class="icon-open-browser width-1of1" target="_blank">${this.state.url}</a>
            </div>
            <div class="widget-content">
            <h4 class="icon-home">Choose Startpage</h4>
            <ul class="flex">
            <li><button class="button width-1of1" name="startPage" value="https://www.opendesktop.org/">opendesktop.org</button></li>
            <li><button class="button width-1of1" name="startPage" value="https://www.opendesktop.org/s/Gnome">gnome-look.org</button></li>
            <li><button class="button width-1of1" name="startPage" value="https://store.kde.org/">store.kde.org</button></li>
            <li><button class="button width-1of1" name="startPage" value="https://www.opendesktop.org/s/XFCE">xfce-look.org</button></li>
            <li><button class="button width-1of1" name="startPage" value="https://www.opendesktop.org/s/Window-Managers">box-look.org</button></li>
            <li><button class="button width-1of1" name="startPage" value="https://www.opendesktop.org/s/Enlightenment">enlightenment-themes.org</button></li>
            </ul>
            </div>
            </div>

            <div data-toggler="inactive"></div>
        `;
    }

    toggle() {
        const omniboxElement = this.contentRoot.querySelector('div[data-omnibox]');
        omniboxElement.setAttribute(
            'data-omnibox',
            (omniboxElement.getAttribute('data-omnibox') === 'active') ? 'inactive' : 'active'
        );

        const paletteElement = this.contentRoot.querySelector('div[data-palette]');
        paletteElement.setAttribute(
            'data-palette',
            (paletteElement.getAttribute('data-palette') === 'active') ? 'inactive' : 'active'
        );

        const togglerElement = this.contentRoot.querySelector('div[data-toggler]');
        togglerElement.setAttribute(
            'data-toggler',
            (togglerElement.getAttribute('data-toggler') === 'active') ? 'inactive' : 'active'
        );
    }

    _handleClick(event) {
        if (event.target.closest('a')) {
            event.preventDefault();
            const anchorElement = event.target.closest('a');
            if (anchorElement.target === '_blank') {
                this.dispatch('ocsManager_externalUrl', {url: anchorElement.href});
            }
            this.toggle();
        }
        else if (event.target.closest('button')) {
            event.preventDefault();
            const buttonElement = event.target.closest('button');
            if (buttonElement.name === 'startPage') {
                this.dispatch('webview_startPage', {url: buttonElement.value});
            }
            this.toggle();
        }
        else if (event.target.closest('div[data-omnibox]')) {
            this.toggle();
        }
        else if (event.target.closest('div[data-toggler]')) {
            this.toggle();
        }
    }

    _viewHandler_webview_page(state) {
        this.update({...this.state, ...state});
    }

}
