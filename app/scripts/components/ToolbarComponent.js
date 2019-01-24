import BaseComponent from './BaseComponent.js';

export default class ToolbarComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <style>
            :host {
                height: 40px;
            }

            nav[data-toolbar] {
                height: inherit;
                border-bottom: 1px solid rgba(0,0,0,0.1);
                background-color: #eeeeee;
            }
            nav[data-toolbar] ul {
                list-style: none;
                height: inherit;
                margin: 0 4px;
                align-items: center;
            }
            nav[data-toolbar] ul li {
                margin: 0 2px;
            }
            nav[data-toolbar] ul li.flex {
                justify-content: center;
            }

            @media (min-width: 900px) {
                nav[data-toolbar] ul li.flex {
                    margin-right: calc(32px * 4);
                }
            }
            </style>

            <nav data-toolbar>
            <ul class="flex">
            <li><menubutton-component data-ref="back"></menubutton-component></li>
            <li><menubutton-component data-ref="forward"></menubutton-component></li>
            <li><menubutton-component data-ref="reload"></menubutton-component></li>
            <li><menubutton-component data-ref="home"></menubutton-component></li>
            <li><menubutton-component data-ref="collection"></menubutton-component></li>
            <li class="flex-auto flex"><omnibox-component></omnibox-component></li>
            <li><menubutton-component data-ref="menu"></menubutton-component></li>
            </ul>
            </nav>
        `;
    }

}
