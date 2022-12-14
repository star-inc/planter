"use strict";
// p.mume planter
// (c) 2022 Star Inc.
// License: BSD 3-Clause License

const axios = require("axios");

function request(config, payload) {
    if (!("webhooks" in config)) return;

    return Promise.all(config.webhooks.map(
        (webhook) => axios.post(webhook, payload)
    ))
}

module.exports = { request }
