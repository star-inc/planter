// p.mume planter
// License: BSD 3-Clause License
// (c) 2021 Star Inc.
const axios = require("axios");

/**
 *
 * @param config
 * @param payload
 * @returns {Promise<unknown[]>}
 */
function request(config, payload) {
    if (!("webhooks" in config)) return;
    return Promise.all(config.webhooks.map(webhook => axios.post(webhook, payload)))
}

module.exports = {request}
