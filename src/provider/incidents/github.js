// p.mume planter
// License: BSD 3-Clause License
// (c) 2021 Star Inc.
const {encode} = require("js-base64");
const {Octokit} = require("@octokit/core");
const {createAppAuth} = require("@octokit/auth-app");

const ProviderInterface = require("./interface");

const {hashCompare} = require("../../utils");

/**
 * GitHub is a company offering a cloud-based Git repository.
 * @type {GitHub}
 */
module.exports = class GitHub extends ProviderInterface {
    /**
     * This is the construct for GitHub.
     * @param config
     * @param timestamp
     */
    constructor(config, timestamp) {
        super(config, timestamp);
        this.timestamp = timestamp;
        this.owner = process.env.INCIDENT_OWNER;
        this.repository = process.env.INCIDENT_REPOSITORY;
        if (process.env.ACCESS_TYPE === "github_app") {
            // GitHub App JWT Token
            const appId = process.env.ACCESS_APP_ID;
            const installationId = process.env.ACCESS_INSTALLATION_ID;
            const privateKey = process.env.ACCESS_TOKEN.replace(/\\n/g, "\n");
            const auth = {appId, privateKey, installationId};
            this.octokit = new Octokit({authStrategy: createAppAuth, auth});
        } else {
            // Personal Token
            const auth = process.env.ACCESS_TOKEN;
            this.octokit = new Octokit({auth});
        }
    }

    /**
     * This is issue method, to be used for updating incidents.
     * @param data
     * @returns {Promise<(*|*)[]>}
     */
    async issue(data) {
        const b64Data = encode(data);
        const previousState = await this._fetchPreviousState();
        if (hashCompare(b64Data, previousState.content)) return;
        const previousUpdateInfo = await this._fetchPreviousUpdateInfo();
        return [
            await this._uploadState(this.timestamp, previousState.sha, b64Data),
            await this._uploadUpdateInfo(this.timestamp, previousUpdateInfo.sha)
        ];
    }

    /**
     *
     * @returns {Promise<{sha: null}>}
     * @private
     */
    async _fetchPreviousUpdateInfo() {
        let updateInfo;
        try {
            updateInfo = await this._getPreviousUpdateInfo();
        } catch (e) {
            console.warn(e);
            updateInfo = {data: {sha: null}};
        }
        if (!("data" in updateInfo)) process.exit(1);
        if (!("sha" in updateInfo.data)) process.exit(1);
        return updateInfo.data;
    }

    /**
     *
     * @returns {Promise<{sha: null, content: string}>}
     * @private
     */
    async _fetchPreviousState() {
        let state;
        try {
            state = await this._getPreviousState();
        } catch (e) {
            console.warn(e);
            state = {data: {sha: null, content: ""}};
        }
        if (!("data" in state)) process.exit(1);
        if (!("sha" in state.data)) process.exit(1);
        if (!("content" in state.data)) process.exit(1);
        state.data.content = state.data.content.replace(/\n/g, "");
        return state.data;
    }

    /**
     *
     * @returns {Promise<OctokitResponse<any>>}
     * @private
     */
    _getPreviousUpdateInfo() {
        const route = `GET /repos/{owner}/{repo}/contents/update.json`;
        const options = {owner: this.owner, repo: this.repository};
        return this.octokit.request(route, options);
    }

    /**
     *
     * @returns {Promise<OctokitResponse<any>>}
     * @private
     */
    _getPreviousState() {
        const route = `GET /repos/{owner}/{repo}/contents/state.json`;
        const options = {owner: this.owner, repo: this.repository};
        return this.octokit.request(route, options);
    }

    /**
     *
     * @param timestamp
     * @param previousSha
     * @returns {Promise<OctokitResponse<any>>}
     * @private
     */
    _uploadUpdateInfo(timestamp, previousSha) {
        const route = `PUT /repos/{owner}/{repo}/contents/update.json`;
        const options = {
            owner: this.owner,
            repo: this.repository,
            content: encode(JSON.stringify({timestamp})),
            sha: previousSha,
            message: `UpdateInfo #${timestamp}`,
        };
        return this.octokit.request(route, options);
    }

    /**
     *
     * @param timestamp
     * @param previousSha
     * @param b64Data
     * @returns {Promise<OctokitResponse<any>>}
     * @private
     */
    _uploadState(timestamp, previousSha, b64Data) {
        const route = `PUT /repos/{owner}/{repo}/contents/state.json`;
        const options = {
            owner: this.owner,
            repo: this.repository,
            content: b64Data,
            sha: previousSha,
            message: `State #${timestamp}`,
        };
        return this.octokit.request(route, options);
    }
}
