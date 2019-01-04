/**
 * Chirit
 *
 * @author      Akira Ohgaki <akiraohgaki@gmail.com>
 * @copyright   Akira Ohgaki
 * @license     https://opensource.org/licenses/BSD-2-Clause
 * @link        https://github.com/akiraohgaki/chirit
 */

export default class WebStorage {

    constructor(type = 'local', prefix = '') {
        switch (type) {
            case 'local':
                this._storage = window.localStorage;
                break;
            case 'session':
                this._storage = window.sessionStorage;
                break;
            default:
                throw new Error('Storage type must be "local" or "session"');
        }
        this._type = type;
        this._prefix = prefix;
    }

    get type() {
        return this._type;
    }

    get prefix() {
        return this._prefix;
    }

    get length() {
        return this._storage.length;
    }

    key(index) {
        return this._storage.key(index);
    }

    setItem(key, value) {
        this._storage.setItem(
            this._prefix + key,
            JSON.stringify({_key: key, _value: value})
        );
    }

    getItem(key) {
        const value = this._storage.getItem(this._prefix + key);
        if (value) {
            const deserializedValue = JSON.parse(value);
            if (deserializedValue
                && deserializedValue._key === key
                && deserializedValue._value !== undefined
            ) {
                return deserializedValue._value;
            }
            return value;
        }
        return null;
    }

    removeItem(key) {
        this._storage.removeItem(this._prefix + key);
    }

    clear() {
        this._storage.clear();
    }

}
