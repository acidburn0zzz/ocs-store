/**
 * Chirit
 *
 * @author      Akira Ohgaki <akiraohgaki@gmail.com>
 * @copyright   2018, Akira Ohgaki
 * @license     https://opensource.org/licenses/BSD-2-Clause
 * @link        https://github.com/akiraohgaki/chirit
 */

export default class Component extends HTMLElement {

    static define(name, options) {
        window.customElements.define(name, this, options);
    }

    constructor() {
        super();

        this._state = {};
        this._shadowRoot = null;
        this._template = null;

        this._updateCount = 0;

        this.initShadow();
        this.initTemplate();
        this.init();
    }

    set state(state) {
        this.setState(state);
    }

    get state() {
        return this.getState();
    }

    get contentRoot() {
        return this._shadowRoot || this.shadowRoot || this;
    }

    initShadow() {
        this.enableShadow();
    }

    initTemplate() {
        this.importTemplate(document.createElement('template'));
    }

    setState(state) {
        if (typeof state !== 'object' || state === null) {
            throw new TypeError(`"${state}" is not an object`);
        }

        const oldState = Object.assign({}, this._state);
        this._state = state;
        const newState = Object.assign({}, this._state);

        this._stateChangedCallback(oldState, newState);
    }

    getState() {
        return this._state;
    }

    setContent(content) {
        // "content" should be Node object or string
        if (typeof content === 'string') {
            const template = document.createElement('template');
            template.innerHTML = content;
            content = template.content;
        }

        const oldContent = this.exportTemplate().content;
        this._template.content.textContent = null;
        this._template.content.appendChild(content);
        const newContent = this.exportTemplate().content;

        this.contentRoot.textContent = null;
        this.contentRoot.appendChild(newContent.cloneNode(true));

        this._contentChangedCallback(oldContent, newContent);
    }

    enableShadow(options = {}) {
        this._shadowRoot = this.attachShadow(Object.assign(
            {mode: 'open'},
            options
        ));
    }

    importTemplate(template) {
        if (!(template instanceof HTMLTemplateElement)) {
            throw new TypeError(`"${template}" is not a HTMLTemplateElement`);
        }
        this._template = template.cloneNode(true);
    }

    exportTemplate() {
        return this._template.cloneNode(true);
    }

    dispatch(type, data = {}) {
        this.dispatchEvent(new CustomEvent(type, {
            detail: data,
            bubbles: true,
            composed: true
        }));
    }

    update(state) {
        if (state !== undefined) {
            this.setState(state);
        }
        else {
            this._update();
        }
    }

    _update() {
        let content = this.render();
        if (typeof content !== 'string' && !content) {
            content = this.exportTemplate().content;
        }

        this.setContent(content);

        this._updatedCallback();
    }

    // Abstract methods

    init() {}

    render() {}

    // Lifecycle methods

    static get componentObservedAttributes() {
        return [];
    }

    componentAttributeChangedCallback() {}

    componentConnectedCallback() {}

    componentDisconnectedCallback() {}

    componentAdoptedCallback() {}

    componentStateChangedCallback() {}

    componentContentChangedCallback() {}

    componentUpdatedCallback() {}

    // Lifecycle methods in parent class

    static get observedAttributes() {
        return this.componentObservedAttributes;
    }

    attributeChangedCallback(attributeName, oldValue, newValue, namespace) {
        this.componentAttributeChangedCallback(attributeName, oldValue, newValue, namespace);
        if (this._updateCount && oldValue !== newValue) {
            this._update();
        }
    }

    connectedCallback() {
        this.componentConnectedCallback();
        if (!this._updateCount) {
            this._update();
        }
    }

    disconnectedCallback() {
        this.componentDisconnectedCallback();
    }

    adoptedCallback(oldDocument, newDocument) {
        this.componentAdoptedCallback(oldDocument, newDocument);
        if (!this._updateCount) {
            this._update();
        }
    }

    // Additional lifecycle methods

    _stateChangedCallback(oldState, newState) {
        this.componentStateChangedCallback(oldState, newState);
        //if (this._updateCount && JSON.stringify(oldState) !== JSON.stringify(newState)) {
        //    this.update();
        //}
        if (this._updateCount) {
            this._update();
        }
    }

    _contentChangedCallback(oldContent, newContent) {
        this.componentContentChangedCallback(oldContent, newContent);
    }

    _updatedCallback() {
        this._updateCount++;
        this.componentUpdatedCallback();
    }

}
