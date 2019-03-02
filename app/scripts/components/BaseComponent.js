import Chirit from '../../libs/chirit/Chirit.js';

export default class BaseComponent extends Chirit.Component {

    get sharedStyle() {
        return `
            <link href="libs/chirit/css/alt.css" rel="stylesheet">
            <link href="libs/chirit/css/ui.css" rel="stylesheet">
            <link href="images/icon.css" rel="stylesheet">
            <link href="styles/component.css" rel="stylesheet">
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
