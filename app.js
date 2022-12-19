// p.mume planter
// (c) 2022 Star Inc.
// License: BSD 3-Clause License
"use strict";

// Load configs from .env
(() => {
    const { existsSync } = require("fs");
    const { join: pathJoin } = require("path");
    const dotenvPath = pathJoin(__dirname, ".env");
    if (!existsSync(dotenvPath) && !process.env.APP_CONFIGURED) {
        throw new Error(".env not exists");
    }
    require("dotenv").config();
})();

// Main
(async () => {
    const timestamp = new Date().getTime();

    const config = await getConfig();
    if (!(config instanceof Object)) {
        console.error("Invalid config");
        process.exit(1);
    }

    const result = await ping(config);
    const data = JSON.stringify(result);

    const storage = new providers[providerValue](config, timestamp);
    if (!(storage instanceof incidentsProviderInterface)) {
        console.error("Invalid incidents storage provider");
        process.exit(1);
    }

    try {
        if (await storage.issue(data)) {
            await request(config, result)
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
