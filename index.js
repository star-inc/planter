const axios = require('axios');
const jsYaml = require('js-yaml');
const {Octokit} = require("@octokit/core");
const {createAppAuth} = require("@octokit/auth-app");
const {sha256} = require('js-sha256');
const {encode} = require('js-base64');

const timestamp = new Date().getTime();

const configSource = process.env.CONFIG_SOURCE_URL;
const incidentsOwner = process.env.INCIDENT_OWNER;
const incidentsRepository = process.env.INCIDENT_REPOSITORY;

const pingOperator = axios.create();
pingOperator.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

let octokit;
if (process.env.ACCESS_TYPE === "github_app") {
    // GitHub App JWT Token
    const appId = process.env.ACCESS_APP_ID;
    const installationId = process.env.ACCESS_INSTALLATION_ID;
    const privateKey = process.env.ACCESS_TOKEN.replace(/\\n/g, "\n");
    auth = {appId, privateKey, installationId};
    octokit = new Octokit({authStrategy: createAppAuth, auth});
} else {
    // Personal Token
    auth = process.env.ACCESS_TOKEN;
    octokit = new Octokit({auth});
}

async function getConfigSource() {
    if (configSource === undefined) return;
    const configFile = await axios.get(configSource);
    if (configFile.status !== 200) return;
    return jsYaml.load(configFile.data);
}

async function ping(site, parent = null) {
    if (!("endpoint" in site)) return;
    let state;
    try {
        state = await pingOperator.get(site.endpoint);
    } catch (e) {
        console.log(e);
        state = e.response;
    }
    site.status = state.status;
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

function getPreviousState() {
    const route = `GET /repos/{owner}/{repo}/contents/state.json`;
    const options = {owner: incidentsOwner, repo: incidentsRepository};
    return octokit.request(route, options);
}

async function newState(timestamp, data, previousStateSha = null) {
    let previousUpdateInfo;
    try {
        previousUpdateInfo = await getPreviousUpdateInfo();
    } catch (e) {
        console.warn(e);
        previousUpdateInfo = {data: {sha: null}};
    }
    if (!("data" in previousUpdateInfo)) process.exit(1);
    if (!("sha" in previousUpdateInfo.data)) process.exit(1);
    const previousUpdateInfoSha = previousUpdateInfo.data.sha;
    return [
        await uploadUpdateInfo({timestamp}, previousUpdateInfoSha),
        await uploadState(timestamp, data, previousStateSha)
    ];
}

function uploadUpdateInfo(info, previousSha = null) {
    const route = `PUT /repos/{owner}/{repo}/contents/update.json`;
    const options = {
        owner: incidentsOwner,
        repo: incidentsRepository,
        content: encode(JSON.stringify(info)),
        sha: previousSha,
        message: `UpdateInfo #${info.timestamp}`,
    };
    return octokit.request(route, options);
}

function uploadState(timestamp, data, previousSha = null) {
    const route = `PUT /repos/{owner}/{repo}/contents/state.json`;
    const options = {
        owner: incidentsOwner,
        repo: incidentsRepository,
        content: encode(data),
        sha: previousSha,
        message: `State #${timestamp}`,
    };
    return octokit.request(route, options);
}

function requestWebhooks(config, payload) {
    if (!("webhooks" in config)) return;
    return Promise.all(config.webhooks.map(webhook => axios.post(webhook, payload)))
}

async function main() {
    const config = await getConfigSource();
    if (!(config instanceof Object)) process.exit(1);
    const result = await pingSites(config);
    const data = JSON.stringify(result);
    let previousState;
    try {
        previousState = await getPreviousState();
    } catch (e) {
        console.warn(e);
        previousState = {data: {sha: null, content: ""}};
    }
    if (!("data" in previousState)) process.exit(1);
    if (!("content" in previousState.data)) process.exit(1);
    const localHash = sha256(encode(data));
    const remoteHash = sha256(previousState.data.content.replace(/\n/g, ""));
    if (localHash === remoteHash) return;
    if (!("sha" in previousState.data)) process.exit(1);
    const previousSha = previousState.data.sha;
    try {
        const result = await newState(timestamp, data, previousSha);
        console.log(result);
    } catch (e) {
        console.error(e);
    }
    await requestWebhooks(config, result)
}

main();
