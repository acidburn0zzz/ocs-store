import Chirit from '../../libs/chirit/Chirit.js';

export default class BaseComponent extends Chirit.Component {

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
