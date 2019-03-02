import BaseComponent from './BaseComponent.js';

export default class MenubuttonComponent extends BaseComponent {

    init() {
        this.contentRoot.addEventListener('click', this._handleClick.bind(this));
    }

    render() {
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
            nav[data-menuitems] ul li:first-child a {
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
            }
            nav[data-menuitems] ul li:last-child a {
                border-bottom-left-radius: 5px;
                border-bottom-right-radius: 5px;
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
            <app-button data-icon="menu"></app-button>
            </div>

            <nav class="widget fade-in" data-menuitems="inactive">
            <ul class="linklist">
            <li><a href="#" data-action="about">About This App</a></li>
            </ul>
            </nav>

            <div data-toggler="inactive"></div>
        `;
    }

    toggle() {
        const menubuttonElement = this.contentRoot.querySelector('div[data-menubutton]');
        menubuttonElement.setAttribute(
            'data-menubutton',
            (menubuttonElement.getAttribute('data-menubutton') === 'active') ? 'inactive' : 'active'
        );

        const menuitemsElement = this.contentRoot.querySelector('nav[data-menuitems]');
        menuitemsElement.setAttribute(
            'data-menuitems',
            (menuitemsElement.getAttribute('data-menuitems') === 'active') ? 'inactive' : 'active'
        );

        const togglerElement = this.contentRoot.querySelector('div[data-toggler]');
        togglerElement.setAttribute(
            'data-toggler',
            (togglerElement.getAttribute('data-toggler') === 'active') ? 'inactive' : 'active'
        );
    }

    _handleClick(event) {
        this.toggle();
        if (event.target.closest('a')) {
            event.preventDefault();
            const action = event.target.closest('a[data-action]')
                .getAttribute('data-action');
            if (action === 'about') {
                this.dispatch('general_about', {});
            }
        }
    }

}
