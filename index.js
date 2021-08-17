const axios = require('axios');
const jsYaml = require('js-yaml');
const {Octokit} = require("@octokit/core");
const {sha256} = require('js-sha256');
const {encode} = require('js-base64');

const configSource = process.env.CONFIG_SOURCE_URL;
const incidentsOwner = process.env.INCIDENT_OWNER;
const incidentsRepository = process.env.INCIDENT_REPOSITORY;

const pingOperator = axios.create();
pingOperator.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

const octokit = new Octokit({auth: process.env.ACCESS_TOKEN});

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
    const childrenPromises = config.sites.map((site) => {
        if (!("children" in site)) return;
        return Promise.all(site.children.map(ping));
    });
    return await Promise.all([...sitePromises, ...childrenPromises]);
}

async function getPreviousStat() {
    const route = `GET /repos/{owner}/{repo}/contents/stat.json`;
    const options = {owner: incidentsOwner, repo: incidentsRepository};
    return await octokit.request(route, options);
}

async function newStat(message, data, sha = null) {
    const route = `PUT /repos/{owner}/{repo}/contents/stat.json`;
    const options = {
        owner: incidentsOwner,
        repo: incidentsRepository,
        sha: sha ? sha : sha256(data),
        content: encode(data),
        message,
    };
    return await octokit.request(route, options);
}

async function main() {
    const config = await getConfigSource();
    if (!(config instanceof Object)) return;
    const result = await pingSites(config);
    const data = JSON.stringify(result);
    const localHash = sha256(data);
    const previousStat = await getPreviousStat();
    if (!("sha" in previousStat) || previousStat.sha === localHash) return;
    const timestamp = new Date().getTime();
    console.log(newStat(`#${timestamp}`, data, localHash))
}

main();
