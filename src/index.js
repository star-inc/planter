const axios = require('axios');
const jsYaml = require('js-yaml');
const github = require("./provider/incidents/github");

const incidentsProviderInterface = require("./provider/incidents/interface");

const ping = require("./ping");
const {request} = require("./webhook");

const providers = {github}
const providerValue = process.env.INCIDENTS_STORAGE_PROVIDER;

async function main() {
    const timestamp = new Date().getTime();
    const config = await getConfigSource();
    if (!(config instanceof Object)) process.exit(1);
    const result = await ping(config);
    const data = JSON.stringify(result);
    const storage = new providers[providerValue](config, timestamp);
    if (!(storage instanceof incidentsProviderInterface)) process.exit(1);
    try {
        if (await storage.issue(data)) {
            await request(config, result)
        }
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

async function getConfigSource() {
    const configSource = process.env.CONFIG_SOURCE_URL;
    if (configSource === undefined) return;
    const configFile = await axios.get(configSource);
    if (configFile.status !== 200) return;
    return jsYaml.load(configFile.data);
}

module.exports = main;
