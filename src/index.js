// p.mume planter
// (c) 2022 Star Inc.
// License: BSD 3-Clause License
"use strict";

const axios = require('axios');
const jsYaml = require('js-yaml');
const github = require("./provider/github");

const incidentsProviderInterface = require("./interface");

const ping = require("./ping");
const { request } = require("./webhook");

const providers = { github }
const providerValue = process.env.INCIDENTS_STORAGE_PROVIDER;

async function getConfig() {
    const configSource = process.env.CONFIG_SOURCE_URL;
    if (configSource === undefined) return;

    const configFile = await axios.get(configSource);
    if (configFile.status !== 200) return;

    return jsYaml.load(configFile.data);
}

module.exports = main;
