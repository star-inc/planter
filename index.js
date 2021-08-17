const axios = require('axios');
const jsYaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const configSource = process.env.CONFIG_SOURCE_URL;

const pingOperator = axios.create();
pingOperator.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

async function getConfigSource() {
    if (configSource === undefined) return;
    const configFile = await axios.get(configSource);
    if (configFile.status !== 200) return;
    return jsYaml.load(configFile.data);
}

async function ping(site) {
    if (!("endpoint" in site)) return;
    const stat = await pingOperator.get(site.endpoint);
    return {[site.name]: stat.status === 200};
}

async function pingSites(config) {
    if (!("sites" in config)) return;
    const sitePromises = config.sites.map(ping);
    const childrenPromises = config.sites.map((site) => Promise.all(site.children.map(ping)));
    return await Promise.all([...sitePromises, ...childrenPromises]);
}

async function main() {
    const config = await getConfigSource();
    if (!(config instanceof Object)) return;
    const result = await pingSites(config);
    fs.writeFileSync(path.join(__dirname, "exports.json"), JSON.stringify(result));
}

main();
