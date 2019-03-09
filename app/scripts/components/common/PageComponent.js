import BaseComponent from './BaseComponent.js';

export default class PageComponent extends BaseComponent {

    render() {
        return `
            <style>
            ${this.sharedStyle}
            </style>

            <style>
            :host {
                display: flex;
                flex-flow: column nowrap;
            }

            article[data-container] {
                display: flex;
                flex-flow: column nowrap;
                flex: 1 1 auto;
            }

            header[data-header] {
                flex: 0 0 auto;
            }

            div[data-container] {
                display: flex;
                flex-flow: row nowrap;
                flex: 1 1 auto;
            }
            article[data-content] {
                display: flex;
                flex-flow: column nowrap;
                flex: 1 1 auto;
                order: 2;
            }
            aside[data-sidebar] {
                display: flex;
                flex-flow: column nowrap;
                flex: 0 0 auto;
                order: 1;
            }

            footer[data-footer] {
                flex: 0 0 auto;
            }
            </style>

            <article data-container>
            <header data-header><slot name="header"></slot></header>
            <div data-container>
            <article data-content><slot name="content"></slot></article>
            <aside data-sidebar><slot name="sidebar"></slot></aside>
            </div>
            <footer data-footer><slot name="footer"></slot></footer>
            </article>
        `;
    }

}
