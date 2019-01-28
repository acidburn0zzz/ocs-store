const {ipcRenderer} = require('electron');

import BaseComponent from './BaseComponent.js';

export default class MenubuttonComponent extends BaseComponent {

    init() {
        this._menubuttonElement = null;
        this._menuitemsElement = null;
        this._togglerElement = null;
    }

    render() {
        const productName = ipcRenderer.sendSync('app', 'package').productName;

        return `
            ${this.sharedStyle}

            <style>
            :host {
                display: inline-block;
                width: 30px;
                height: 30px;
            }

            div[data-menubutton] {
                width: inherit;
                height: inherit;
            }

            nav[data-menuitems] {
                z-index: 1000;
                position: relative;
                top: 0;
                left: -220px;
                width: 250px;
                background-color: var(--color-content);
                box-shadow: 0 10px 30px var(--color-shadow);
            }
            nav[data-menuitems] ul li a {
                background-color: transparent;
                color: var(--color-text);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            nav[data-menuitems] ul li a:hover {
                background-color: var(--color-active);
                color: var(--color-text);
            }
            nav[data-menuitems="inactive"] {
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

            <div data-menubutton="active">
            <button-component data-icon="menu"></button-component>
            </div>

            <nav class="widget" data-menuitems="inactive">
            <ul class="linklist">
            <li><a href="#" data-action="">Feedback</a></li>
            <li><a href="#" data-action="">About ${productName}</a></li>
            </ul>
            </nav>

            <div data-toggler="inactive"></div>
        `;
    }

    componentUpdatedCallback() {
        this._menubuttonElement = this.contentRoot.querySelector('div[data-menubutton]');
        this._menuitemsElement = this.contentRoot.querySelector('nav[data-menuitems]');
        this._togglerElement = this.contentRoot.querySelector('div[data-toggler]');

        this._menubuttonElement.addEventListener('click', this._toggle.bind(this), false);
        this._togglerElement.addEventListener('click', this._toggle.bind(this), false);

        this._menuitemsElement.addEventListener('click', (event) => {
            if (event.target.closest('a[data-action]')) {
                event.preventDefault();
                /*const action = event.target.closest('a[data-action]')
                    .getAttribute('data-action');
                this.dispatch('', {});*/
                this._toggle();
            }
        }, false);
    }

    _toggle() {
        this._menubuttonElement.setAttribute(
            'data-menubutton',
            (this._menubuttonElement.getAttribute('data-menubutton') === 'active') ? 'inactive' : 'active'
        );
        this._menuitemsElement.setAttribute(
            'data-menuitems',
            (this._menuitemsElement.getAttribute('data-menuitems') === 'active') ? 'inactive' : 'active'
        );
        this._togglerElement.setAttribute(
            'data-toggler',
            (this._togglerElement.getAttribute('data-toggler') === 'active') ? 'inactive' : 'active'
        );
    }

}
