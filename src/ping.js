const axios = require("axios");

const operator = axios.create();

async function ping(config) {
    if (!("servers" in config)) return;
    const serverPromises = config.servers.map(_pingServer);
    return extractPromises(serverPromises);
}

async function extractPromises(promises) {
    return (await Promise.all(promises)).filter(item => !!item)
}

async function _ping(endpoint) {
    try {
        return await operator.get(endpoint);
    } catch (e) {
        console.log(e);
        return e.response;
    }
}

async function _pingServer(server) {
    if (!("endpoint" in server)) return;
    const state = _ping(server.endpoint);
    server.status = state.status;
    if (typeof state.data === "string" && state.data.startsWith("\xef")) {
        server.metadata = state.data;
    }
    if (("services" in server)) {
        const servicePromises = server.services.map(_pingService);
        server.services = await extractPromises(servicePromises)
    }
    return server;
}

async function _pingService(service) {
    if (!("endpoint" in service)) return;
    const state = await _ping(service.endpoint);
    service.status = state.status;
    if (typeof state.data === "string" && state.data.startsWith("\xef")) {
        service.metadata = state.data;
    }
    return service;
}

module.exports = ping;
