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
            button.button {
                box-shadow: none;
                width: inherit;
                height: inherit;
                border: 0;
                background-color: rgba(100,100,100,0.1);
                transition: background-color 0.2s ease-out;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            button.button:hover {
                border: 0;
                background-color: rgba(0,0,0,0.1);
            }
            div.widget {
                position: absolute;
                z-index: 2000;
                width: inherit;
                background-color: #ffffff;
                text-align: left;
            }
            </style>

            <button class="button">${this.state.title}</button>

            <div class="widget">
            <div class="widget-content">
            <h4>Open in browser</h4>
            <p><a data-url="${this.state.url}">${this.state.url}</a></p>
            </div>

            <div class="widget-content">
            <h4>Choose startpage</h4>
            <ul>
            <li><a data-url="https://www.opendesktop.org/">opendesktop.org</a></li>
            <li><a data-url="https://www.opendesktop.org/s/Gnome">gnome-look.org</a></li>
            <li><a data-url="https://store.kde.org/">store.kde.org</a></li>
            <li><a data-url="https://www.opendesktop.org/s/XFCE">xfce-look.org</a></li>
            <li><a data-url="https://www.opendesktop.org/s/Window-Managers">box-look.org</a></li>
            <li><a data-url="https://www.opendesktop.org/s/Enlightenment">enlightenment-themes.org</a></li>
            </ul>
            </div>
            </div>
        `;
    }

}
