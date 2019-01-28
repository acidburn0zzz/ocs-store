import BaseComponent from './BaseComponent.js';

export default class DialogComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <style>
            div[data-overlay] {
                z-index: 1000;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                align-items: center;
                justify-content: center;
            }
            div[data-overlay] div.widget {
                width: 500px;
                background-color: var(--color-content);
                box-shadow: 0 10px 30px var(--color-shadow);
            }
            div[data-overlay] div.widget-header {
                align-items: center;
            }
            div[data-overlay] div.widget-footer {
                align-items: center;
                background-color: var(--color-widget);
            }
            </style>

            <div class="flex" data-overlay>

            <div class="widget">
            <div class="widget-header flex">
            <div class="flex-auto"><slot name="title"></slot></div>
            <div><button-component data-icon="close"></button-component></div>
            </div>
            <div class="widget-content"><slot name="content"></slot></div>
            <div class="widget-footer flex">
            <div class="flex-auto"></div>
            <div><slot name="control"></slot></div>
            </div>
            </div>

            </div>
        `;
    }

}
