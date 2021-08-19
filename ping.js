const axios = require("axios");

export default class {
    constructor() {
        this.pingOperator = axios.create();
    }

    async ping(config) {
        if (!("sites" in config)) return;
        const sitePromises = config.sites.map(this._ping);
        return (await Promise.all(sitePromises)).filter(item => !!item);
    }

    async _ping(site) {
        if (!("endpoint" in site)) return;
        let state;
        try {
            state = await this.pingOperator.get(site.endpoint);
        } catch (e) {
            console.log(e);
            state = e.response;
        }
        site.status = state.status;
        if (typeof state.data === "string" && state.data.startsWith("\xef")) {
            site.metadata = state.data;
        }
        if (("children" in site)) {
            site.children = (await Promise.all(site.children.map(this._ping))).filter(item => !!item)
        }
        return site;
    }
}
