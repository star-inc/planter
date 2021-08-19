const axios = require("axios");

function requestWebhooks(config, payload) {
    if (!("webhooks" in config)) return;
    return Promise.all(config.webhooks.map(webhook => axios.post(webhook, payload)))
}

