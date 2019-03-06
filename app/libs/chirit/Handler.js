/**
 * Chirit
 *
 * @author      Akira Ohgaki <akiraohgaki@gmail.com>
 * @copyright   2018, Akira Ohgaki
 * @license     https://opensource.org/licenses/BSD-2-Clause
 * @link        https://github.com/akiraohgaki/chirit
 */

export default class Handler {

    constructor(handler) {
        // handler:
        // (data = {}, type = '') => {
        //     return {};
        // }

        this._initialHandler = handler;
        this._defaultHandler = null;
        this._typeHandlersCollection = new Map(); // [[type, [handler]]]

        this.resetDefault();
    }

    resetDefault() {
        this.setDefault(this._initialHandler);
        return this;
    }

    setDefault(handler) {
        this._checkTypeOfHandler(handler);
        this._defaultHandler = handler;
        this.defaultChangedCallback(handler);
        return this;
    }

    add(type, handler) {
        this._checkTypeOfHandler(handler);
        this.beforeAddCallback(type, handler);
        const typeHandlers = this._typeHandlersCollection.get(type) || new Set();
        if (!typeHandlers.has(handler)) {
            typeHandlers.add(handler);
            this._typeHandlersCollection.set(type, typeHandlers);
            this.afterAddCallback(type, handler);
        }
        return this;
    }

    remove(type, handler) {
        this._checkTypeOfHandler(handler);
        this.beforeRemoveCallback(type, handler);
        if (this._typeHandlersCollection.has(type)) {
            const typeHandlers = this._typeHandlersCollection.get(type);
            if (typeHandlers.has(handler)) {
                typeHandlers.delete(handler);
                if (typeHandlers.size) {
                    this._typeHandlersCollection.set(type, typeHandlers);
                }
                else {
                    this._typeHandlersCollection.delete(type);
                }
                this.afterRemoveCallback(type, handler);
            }
        }
        return this;
    }

    has(type) {
        return this._typeHandlersCollection.has(type);
    }

    async invoke(data = {}, type = '') {
        // This function will wrap and call registered handlers with Promise and Promise.all().
        // And all return values of the same type of handlers will be combined in object finally.
        // If any handler returned false, will not combine values and return null.

        const promises = [];

        promises.push(new Promise((resolve) => {
            resolve(this._defaultHandler(data, type));
        }));

        if (type && this._typeHandlersCollection.has(type)) {
            const typeHandlers = this._typeHandlersCollection.get(type);
            for (const handler of typeHandlers) {
                promises.push(new Promise((resolve) => {
                    resolve(handler(data, type));
                }));
            }
        }

        const values = await Promise.all(promises);

        if (values.includes(false)) {
            return null;
        }

        const combinedData = {};
        for (const value of values) {
            Object.assign(combinedData, value);
        }
        return combinedData;
    }

    defaultChangedCallback() {}

    beforeAddCallback() {}

    afterAddCallback() {}

    beforeRemoveCallback() {}

    afterRemoveCallback() {}

    _checkTypeOfHandler(handler) {
        if (typeof handler !== 'function') {
            throw new TypeError(`"${handler}" is not a function`);
        }
    }

}
