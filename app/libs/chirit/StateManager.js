/**
 * Chirit
 *
 * @author      Akira Ohgaki <akiraohgaki@gmail.com>
 * @copyright   2018, Akira Ohgaki
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
        this._state = new Map();
        this._eventListener = this._eventListener.bind(this);

        this._eventHandler = null;
        this._actionHandler = null;
        this._stateHandler = null;
        this._viewHandler = null;

        this._initHandlers();
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

    dispatch(type, data = {}) {
        this._target.dispatchEvent(new CustomEvent(type, {detail: data}));
    }

    _eventListener(event) {
        event.preventDefault();
        event.stopPropagation();
        this._invokeHandlers(event.detail, event.type);
    }

    _initHandlers() {
        this._eventHandler = new Handler((data) => {
            return data;
        });

        this._actionHandler = new Handler(() => {
            return {};
        });

        this._stateHandler = new Handler((data, type) => {
            this._state.set(type, data);
            return data;
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

    async _invokeHandlers(data, type) {
        try {
            const eventRusult = await this._eventHandler.invoke(data, type);
            if (!eventRusult) {
                return;
            }
            const actionResult = await this._actionHandler.invoke(eventRusult, type);
            if (!actionResult) {
                return;
            }
            const stateResult = await this._stateHandler.invoke(actionResult, type);
            if (!stateResult) {
                return;
            }
            //const viewResult = await this._viewHandler.invoke(stateResult, type);
            this._viewHandler.invoke(stateResult, type);
        }
        catch (error) {
            console.error(error);
        }
    }

}
