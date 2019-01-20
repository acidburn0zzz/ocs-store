import Handler from '../../libs/chirit/Handler.js';
import Utility from '../../libs/chirit/Utility.js';

export default class OcsManagerWsApi {

    constructor(url) {
        this._url = url;
        this._webSocket = null;

        this._eventHandler = null;
        this._funcHandler = null;

        this._setupHandlers();
    }

    get isConnected() {
        return (this._webSocket && this._webSocket.readyState === 1) ? true : false;
    }

    get eventHandler() {
        return this._eventHandler;
    }

    get funcHandler() {
        return this._funcHandler;
    }

    connect() {
        this.disconnect();
        this._webSocket = new WebSocket(this._url);
        this._setupEventListeners();
    }

    disconnect() {
        if (this.isConnected) {
            this._webSocket.close();
            this._webSocket = null;
        }
    }

    send(id, func, data = []) {
        if (this.isConnected) {
            id = id || Utility.generateRandomString(24);
            this._webSocket.send(JSON.stringify({
                id: id,
                func: func,
                data: data
            }));
            return id;
        }
        return false;
    }

    _setupHandlers() {
        this._eventHandler = new Handler(() => {
            return {};
        });

        this._funcHandler = new Handler(() => {
            return {};
        });
    }

    _setupEventListeners() {
        this._webSocket.addEventListener('open', (event) => {
            this._eventHandler.invoke(event, 'open');
        });

        this._webSocket.addEventListener('close', (event) => {
            this._eventHandler.invoke(event, 'close');
        });

        this._webSocket.addEventListener('message', (event) => {
            this._eventHandler.invoke(event, 'message');

            const data = event.data ? JSON.parse(event.data) : {};
            if (data.func) {
                this._funcHandler.invoke(data, data.func);
            }
        });

        this._webSocket.addEventListener('error', (event) => {
            this._eventHandler.invoke(event, 'error');
        });
    }

}
