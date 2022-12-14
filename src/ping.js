"use strict";
// p.mume planter
// (c) 2022 Star Inc.
// License: BSD 3-Clause License

const axios = require("axios");

const operator = axios.create();

function ping(config) {
    if (!config.servers) return;
    const serverPromises = config.servers.map(_pingServer);
    return Promise
        .all(serverPromises)
        .filter(item => !!item);
}

async function _pingServer(server) {
    if (!server.endpoint) return;
    server = await _getState(server.endpoint);
    server.services = await new Promise
        .all(server.services.map(_getState))
        .filter(item => !!item);
    return server;
}

async function _getState(endpoint) {
    const result = await _doRequest(endpoint);
    const isMetadataValid = typeof state.data === "string" && state.data.startsWith("\xef");

    const state = {};
    state.status = result.status;
    state.metadata = isMetadataValid ? state.data : null;
    return state;
}

async function _doRequest(endpoint) {
    try {
        return await operator.get(endpoint);
    } catch (e) {
        console.log(e);
        return e.response;
    }
}

module.exports = ping;
