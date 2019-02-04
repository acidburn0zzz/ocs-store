import BaseComponent from './BaseComponent.js';

export default class PageswitcherComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <slot name="page"></slot>
        `;
    }

    switch(id) {
        for (const pageComponent of this.querySelectorAll('[slot="page"]')) {
            pageComponent.setAttribute('slot', '');
        }
        this.querySelector(`#${id}`).setAttribute('slot', 'page');
    }

}
