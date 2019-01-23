import BaseComponent from './BaseComponent.js';

export default class ToolbarComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <style>
            nav {
                height: 40px;
                border-bottom: 1px solid rgba(0,0,0,0.1);
                background-color: #eeeeee;
            }
            nav ul {
                list-style: none;
                height: 100%;
                margin: 0 4px;
                align-items: center;
            }
            nav ul li {
                margin: 0 2px;
            }
            </style>

            <nav>
            <ul class="flex">
            <li><menubutton-component data-ref="back"></menubutton-component></li>
            <li><menubutton-component data-ref="forward"></menubutton-component></li>
            <li><menubutton-component data-ref="reload"></menubutton-component></li>
            <li><menubutton-component data-ref="home"></menubutton-component></li>
            <li><menubutton-component data-ref="collection"></menubutton-component></li>
            <li class="flex-auto align-center"><omnibox-component></omnibox-component></li>
            <li><menubutton-component data-ref="menu"></menubutton-component></li>
            </ul>
            </nav>
        `;
    }

}
