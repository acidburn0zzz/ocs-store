export default class OcsManagerApi {

    constructor(url) {
        this._url = url;

        this._websocket = null;
        this._callback = new Map();

        this._autoReconnect = false;
    }

    get callback() {
        return this._callback;
    }

    get isConnected() {
        return (this._websocket && this._websocket.readyState === 1) ? true : false;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            if (!this.isConnected) {
                this._websocket = new WebSocket(this._url);
                this._autoReconnect = true;

                this._websocket.addEventListener('open', () => {
                    resolve(true);
                });

                this._websocket.addEventListener('message', (event) => {
                    const message = event.data ? JSON.parse(event.data) : {};
                    if (message.func && this._callback.has(message.func)) {
                        const callback = this._callback.get(message.func);
                        callback(message);
                    }
                });

                this._websocket.addEventListener('close', () => {
                    if (this._autoReconnect) {
                        setTimeout(() => {
                            this._websocket = null;
                            this.connect();
                        }, 3000);
                    }
                });

                this._websocket.addEventListener('error', () => {
                    this._websocket = null;
                    reject(new Error('WebSocket connection error'));
                });
            }
            else {
                reject(new Error('WebSocket is already connected'));
            }
        });
    }

    async disconnect() {
        return new Promise((resolve, reject) => {
            if (this.isConnected) {
                this._autoReconnect = false;

                this._websocket.addEventListener('close', () => {
                    this._websocket = null;
                    resolve(true);
                });

                this._websocket.close();
            }
            else {
                reject(new Error('WebSocket is not connected'));
            }
        });
    }

    async send(func, data = [], id = '') {
        return new Promise((resolve, reject) => {
            id = id || this._generateId();

            if (this.isConnected) {
                this._websocket.send(JSON.stringify({
                    id: id,
                    func: func,
                    data: data
                }));
                resolve(id);
            }
            else {
                reject(new Error('WebSocket is not connected'));
            }
        });
    }

    async sendSync(func, data = [], id = '') {
        return new Promise((resolve, reject) => {
            id = id || this._generateId();

            let webSocket = new WebSocket(this._url);

            webSocket.addEventListener('open', () => {
                webSocket.send(JSON.stringify({
                    id: id,
                    func: func,
                    data: data
                }));
            });

            webSocket.addEventListener('message', (event) => {
                const message = event.data ? JSON.parse(event.data) : {};
                if (message.id && message.id === id) {
                    webSocket.close();
                    resolve(message);
                }
            });

            webSocket.addEventListener('close', () => {
                webSocket = null;
            });

            webSocket.addEventListener('error', () => {
                webSocket = null;
                reject(new Error(`WebSocket connection error (id: ${id})`));
            });
        });
    }

    _generateId() {
        const length = 16;

        const strings = '0123456789'
            + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            + 'abcdefghijklmnopqrstuvwxyz';
        const stringArray = strings.split('');

        let randomString = '';
        for (let i = 0; i < length; i++) {
            randomString += stringArray[Math.floor(Math.random() * stringArray.length)];
        }
        return randomString;
    }

}
