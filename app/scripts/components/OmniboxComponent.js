import BaseComponent from './BaseComponent.js';

export default class OmniboxComponent extends BaseComponent {

    init() {
        this.state = {
            url: '',
            title: ''
        };
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
            div.widget {
                box-shadow: none;
                width: inherit;
                height: inherit;
                border: 0;
                background-color: rgba(255,255,255,0.5);
                align-items: center;
                cursor: pointer;
                transition: background-color 0.2s ease-out;
            }
            div.widget:hover {
                background-color: rgba(255,255,255,1.0);
            }
            div.widget span {
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin: 0 1em;
            }
            </style>

            <div class="flex widget">
            <span>${this.state.title}</span>
            </div>
        `;
    }

}
