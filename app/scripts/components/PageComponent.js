import BaseComponent from './BaseComponent.js';

export default class PageComponent extends BaseComponent {

    render() {
        return `
            ${this.sharedStyle}

            <article class="flex-auto flex-column">
            <header><slot name="header"></slot></header>
            <div class="flex-auto flex">
            <article class="flex-auto flex-order2 flex-column"><slot name="content"></slot></article>
            <aside class=" flex-order1 flex-column"><slot name="sidebar"></slot></aside>
            </div>
            <footer><slot name="footer"></slot></footer>
            </article>
        `;
    }

}
