/**
 * Chirit
 *
 * @author      Akira Ohgaki <akiraohgaki@gmail.com>
 * @copyright   Akira Ohgaki
 * @license     https://opensource.org/licenses/BSD-2-Clause
 * @link        https://github.com/akiraohgaki/chirit
 */

import Handler from './Handler.js';

export default class StateManager {

    constructor(target) {
        // "target" should be Element object or selector string
        if (typeof target === 'string') {
            target = document.querySelector(target);
        }

        this._target = target || document;
        this._eventListener = this._eventListener.bind(this);
        this._state = new Map();

        this._eventHandler = null;
        this._actionHandler = null;
        this._stateHandler = null;
        this._viewHandler = null;

        this._setupHandlers();
    }

    get target() {
        return this._target;
    }

    get state() {
        return this._state;
    }

    get eventHandler() {
        return this._eventHandler;
    }

    get actionHandler() {
        return this._actionHandler;
    }

    get stateHandler() {
        return this._stateHandler;
    }

    get viewHandler() {
        return this._viewHandler;
    }

    dispatch(type, params = {}) {
        this._target.dispatchEvent(new CustomEvent(type, {detail: params}));
    }

    _eventListener(event) {
        event.preventDefault();
        event.stopPropagation();
        this._invokeHandlers(event.detail, event.type);
    }

    _setupHandlers() {
        this._eventHandler = new Handler((params) => {
            return params;
        });

        this._actionHandler = new Handler(() => {
            return {};
        });

        this._stateHandler = new Handler((state, type) => {
            this._state.set(type, state);
            return state;
        });

        this._viewHandler = new Handler(() => {
            return {};
        });

        const beforeAddCallback = (type) => {
            if (!this._eventHandler.has(type)
                && !this._actionHandler.has(type)
                && !this._stateHandler.has(type)
                && !this._viewHandler.has(type)
            ) {
                this._target.addEventListener(type, this._eventListener, false);
                this._state.set(type, {});
            }
        };

        const afterRemoveCallback = (type) => {
            if (!this._eventHandler.has(type)
                && !this._actionHandler.has(type)
                && !this._stateHandler.has(type)
                && !this._viewHandler.has(type)
            ) {
                this._target.removeEventListener(type, this._eventListener, false);
                this._state.delete(type);
            }
        };

        this._eventHandler.beforeAddCallback = beforeAddCallback;
        this._eventHandler.afterRemoveCallback = afterRemoveCallback;

        this._actionHandler.beforeAddCallback = beforeAddCallback;
        this._actionHandler.afterRemoveCallback = afterRemoveCallback;

        this._stateHandler.beforeAddCallback = beforeAddCallback;
        this._stateHandler.afterRemoveCallback = afterRemoveCallback;

        this._viewHandler.beforeAddCallback = beforeAddCallback;
        this._viewHandler.afterRemoveCallback = afterRemoveCallback;
    }

    async _invokeHandlers(params, type) {
        try {
            const passedParams = await this._eventHandler.invoke(params, type);
            if (!passedParams) {
                return;
            }
            const state = await this._actionHandler.invoke(passedParams, type);
            if (!state) {
                return;
            }
            const passedState = await this._stateHandler.invoke(state, type);
            if (!passedState) {
                return;
            }
            //const data = await this._viewHandler.invoke(passedState, type);
            this._viewHandler.invoke(passedState, type);
        }
        catch (error) {
            console.error(error);
        }
    }

}
