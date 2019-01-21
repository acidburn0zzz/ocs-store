export default class OcsManagerModule {

    constructor(stateManager, ocsManagerWsApi) {
        this.stateManager = stateManager;
        this.ocsManagerWsApi = ocsManagerWsApi;

        /*
        this.ocsManagerWsApi.eventHandler.add('open', (event) => {
        });

        this.ocsManagerWsApi.eventHandler.add('close', (event) => {
        });

        this.ocsManagerWsApi.eventHandler.add('message', (event) => {
        });

        this.ocsManagerWsApi.eventHandler.add('error', (event) => {
        });

        this.ocsManagerWsApi.funcHandler.add('', (data) => {
        });

        this.ocsManagerWsApi.connect();
        */
    }

}
