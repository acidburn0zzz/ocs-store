import Chirit from '../../libs/chirit/Chirit.js';

export default class BaseComponent extends Chirit.Component {

    get rootState() {
        return document.querySelector('root-component').state;
    }

    get sharedStyle() {
        return `
            <link href="libs/chirit/css/alt.css" rel="stylesheet">
            <link href="libs/chirit/css/ui.css" rel="stylesheet">
            <link href="images/icon.css" rel="stylesheet">
            <link href="styles/component.css" rel="stylesheet">
        `;
    }

}
