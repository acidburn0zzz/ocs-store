import BaseComponent from './BaseComponent.js';

export default class ToolbarComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <nav>
            </nav>
        `;
    }

}
