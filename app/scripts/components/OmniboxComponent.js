import BaseComponent from './BaseComponent.js';

export default class OmniboxComponent extends BaseComponent {

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
                width: 100%;
                height: 100%;
                border: 0;
                background-color: rgba(255,255,255,0.5);
                align-items: center;
                cursor: pointer;
                transition: background-color 0.2s ease-out;
            }
            div.widget:hover {
                background-color: rgba(255,255,255,1.0);
            }
            </style>

            <div class="flex widget">
            <span>aaa</span>
            </div>
        `;
    }

}
