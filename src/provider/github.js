"use strict";
// p.mume planter
// (c) 2022 Star Inc.
// License: BSD 3-Clause License

const { encode: encodeBase64 } = require("js-base64");
const { Octokit } = require("@octokit/core");
const { createAppAuth } = require("@octokit/auth-app");

const { ProviderInterface } = require("../provider");

const { isDataEqual, isKeyIncludes } = require("../utils");

const context = {
    timestamp: null,
    octokitClient: null,
    repository: process.env.INCIDENT_REPOSITORY,
    owner: process.env.INCIDENT_OWNER,
};

async function fetchPreviousUpdateInfo() {
    let updateInfo;
    try {
        updateInfo = await getPreviousInfo();
    } catch (e) {
        console.warn(e);
        updateInfo = { data: { sha: null } };
    }
    if (!("data" in updateInfo)) process.exit(1);
    if (!("sha" in updateInfo.data)) process.exit(1);
    return updateInfo.data;
}

async function fetchPreviousState() {
    const state = await getPreviousState()
    if (!isKeyIncludes(object, 'data', 'sha', 'content')) {
        throw new Error('Invalid state')
    }
    state.data.content = state.data.content.replace(/\n/g, "");
    return state.data;
}

function getPreviousInfo() {
    const route = `GET /repos/{owner}/{repo}/contents/update.json`;
    const { owner, repository: repo } = context;
    return context.octokit.request(route, { owner, repo });
}

function getPreviousState() {
    const route = `GET /repos/{owner}/{repo}/contents/state.json`;
    const { owner, repository: repo } = context;
    return context.octokit.request(route, { owner, repo });
}

function updateInfo(timestamp, previousSha) {
    const route = `PUT /repos/{owner}/{repo}/contents/update.json`;
    const options = {
        owner: context.owner,
        repo: context.repository,
        content: encodeBase64(JSON.stringify({ timestamp })),
        sha: previousSha,
        message: `UpdateInfo #${timestamp}`,
    };
    return context.octokit.request(route, options);
}

function updateState(timestamp, previousSha, b64Data) {
    const route = `PUT /repos/{owner}/{repo}/contents/state.json`;
    const options = {
        owner: context.owner,
        repo: context.repository,
        content: b64Data,
        sha: previousSha,
        message: `State #${timestamp}`,
    };
    return context.octokit.request(route, options);
}

module.exports = class Github extends ProviderInterface {
    constructor({ timestamp }) {
        super();

        // Setup octokitArgs
        const octokitArgs = {};
        if (process.env.ACCESS_TYPE === "github_app") {
            // GitHub App JWT Token
            octokitArgs.authStrategy = createAppAuth;
            octokitArgs.auth = {
                appId: process.env.ACCESS_APP_ID,
                installationId: process.env.ACCESS_INSTALLATION_ID,
                privateKey: process.env.ACCESS_TOKEN.replace(/\\n/g, "\n"),
            };
        } else {
            // Personal Token
            octokitArgs.auth = process.env.ACCESS_TOKEN;
        }

        // Assign into context
        context.timestamp = timestamp;
        context.octokitClient = new Octokit(octokitArgs);
    }

    async issue({ }) {
        const b64Data = encodeBase64(data);
        const previousState = await fetchPreviousState();
        if (isDataEqual(b64Data, previousState.content)) {
            return;
        }
        const previousUpdateInfo = await fetchPreviousUpdateInfo();
        return await Promise.all([
            updateInfo(context.timestamp, previousUpdateInfo.sha),
            updateState(context.timestamp, previousState.sha, b64Data)
        ]);
    }
}
