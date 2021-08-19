const axios = require('axios');
const jsYaml = require('js-yaml');
const github = require("./provider/incidents/github");

async function main() {
    const incidentsStorageProvider = process.env.INCIDENTS_STORAGE_PROVIDER;
    const timestamp = new Date().getTime();
    const incidentsStorageProviders = {github}
    const config = await getConfigSource();
    if (!(config instanceof Object)) process.exit(1);
    const result = await pingSites(config);
    const data = JSON.stringify(result);
    const incidentsStorage = new incidentsStorageProviders[incidentsStorageProvider](config);
    try {
        await requestWebhooks(config, result)
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

main();
