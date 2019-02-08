import BaseComponent from './BaseComponent.js';

export default class SwitchviewComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <slot name="current"></slot>
        `;
    }

    switch(id) {
        for (const content of this.querySelectorAll('[slot="current"]')) {
            content.setAttribute('slot', '');
        }

        const target = this.querySelector(`#${id}`);
        if (target) {
            target.setAttribute('slot', 'current');
        }
    }

}
