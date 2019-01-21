import BaseComponent from './BaseComponent.js';

export default class StatusbarComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <div>
            </div>
        `;
    }

}
