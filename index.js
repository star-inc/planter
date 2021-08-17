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

async function ping(site, parent = null) {
    if (!("endpoint" in site)) return;
    let stat;
    try {
        stat = await pingOperator.get(site.endpoint);
    } catch (e) {
        console.log(e);
        stat = e.response;
    }
    site.status = stat.status;
    site.parent = parent;
    return site;
}

async function pingSites(config) {
    if (!("sites" in config)) return;
    const sitePromises = config.sites.map((site) => ping(site));
    const childrenPromises = config.sites.map((site) => {
        if (!("children" in site)) return;
        return Promise.all(site.children.map((child) => ping(child, site.name)));
    });
    return await Promise.all([
        ...sitePromises.filter(promise => !!promise),
        ...childrenPromises.filter(promise => !!promise)
    ]);
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
    let previousStat;
    try {
        previousStat = await getPreviousStat();
    } catch (e) {
        console.warn(e);
        previousStat = {sha: null};
    }
    if (
        !("data" in previousStat) ||
        !("sha" in previousStat.data) ||
        previousStat.data.sha === localHash
    ) return;
    const timestamp = new Date().getTime();
    try {
        const result = await newStat(`#${timestamp}`, data, localHash);
        console.log(result);
    } catch (e) {
        console.error(e);
    }
}

main();
