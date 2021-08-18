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

function getPreviousUpdateInfo() {
    const route = `GET /repos/{owner}/{repo}/contents/update.json`;
    const options = {owner: incidentsOwner, repo: incidentsRepository};
    return octokit.request(route, options);
}

function getPreviousStat() {
    const route = `GET /repos/{owner}/{repo}/contents/stat.json`;
    const options = {owner: incidentsOwner, repo: incidentsRepository};
    return octokit.request(route, options);
}

async function newStat(timestamp, data, previousStatSha = null) {
    let previousUpdateInfo;
    try {
        previousUpdateInfo = await getPreviousUpdateInfo();
    } catch (e) {
        console.warn(e);
        previousUpdateInfo = {data: {sha: null}};
    }
    if (!("data" in previousUpdateInfo) || !("sha" in previousUpdateInfo.data)) return;
    const previousUpdateInfoSha = previousUpdateInfo.data.sha;
    return [
        await uploadUpdateInfo({timestamp}, previousUpdateInfoSha),
        await uploadStat(timestamp, data, previousStatSha)
    ];
}

function uploadUpdateInfo(info, previousSha = null) {
    const route = `PUT /repos/{owner}/{repo}/contents/update.json`;
    const options = {
        owner: incidentsOwner,
        repo: incidentsRepository,
        content: encode(JSON.stringify(info)),
        sha: previousSha,
        message: `#${info.timestamp}`,
    };
    return octokit.request(route, options);
}

function uploadStat(timestamp, data, previousSha = null) {
    const route = `PUT /repos/{owner}/{repo}/contents/stat.json`;
    const options = {
        owner: incidentsOwner,
        repo: incidentsRepository,
        content: encode(data),
        sha: previousSha,
        message: `#${timestamp}`,
    };
    return octokit.request(route, options);
}

async function main() {
    const config = await getConfigSource();
    if (!(config instanceof Object)) return;
    const timestamp = new Date().getTime();
    const result = await pingSites(config);
    const data = JSON.stringify(result);
    const localHash = sha256(data);
    let previousStat;
    try {
        previousStat = await getPreviousStat();
    } catch (e) {
        console.warn(e);
        previousStat = {data: {sha: null}};
    }
    if (!("data" in previousStat) || !("sha" in previousStat.data) || previousStat.data.sha === localHash) return;
    const previousSha = previousStat.data.sha;
    try {
        const result = await newStat(timestamp, data, previousSha);
        console.log(result);
    } catch (e) {
        console.error(e);
    }
}

main();
