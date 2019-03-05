import {html, render, TemplateResult} from 'lit-html';

import Chirit from '../../../libs/chirit/Chirit.js';

export default class BaseComponent extends Chirit.Component {

    constructor() {
        super();
        this.html = html;
    }

    setContent(content) {
        if (content instanceof TemplateResult) {
            render(content, this.contentRoot);
        }
        else {
            super.setContent(content);
        }
    }

    get sharedStyle() {
        return `
            <style>
            @import url(styles/reset.css);
            @import url(styles/component.css);
            </style>
        `;
    }

    getStateManager() {
        return document.querySelector('app-root').getStateManager();
    }

    convertItemKeyToPreviewpicFilename(itemKey) {
        // See also btoa() in main.js
        return btoa(itemKey).slice(-255);
    }

}
