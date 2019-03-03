import BaseComponent from './BaseComponent.js';

export default class SwitchviewComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <slot name="content"></slot>
        `;
    }

    switch(id) {
        for (const content of this.querySelectorAll('[slot="content"]')) {
            content.slot = '';
        }

        const target = this.querySelector(`#${id}`);
        if (target) {
            target.slot = 'content';
        }
    }

}
