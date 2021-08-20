const {Octokit} = require("@octokit/core");
const {createAppAuth} = require("@octokit/auth-app");

const providerInterface = require("./interface");
const {hashCompare} = require("../../utils");

const {encode} = require("js-base64");

module.exports = class extends providerInterface {
    constructor(_, timestamp) {
        super();
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

    async issue(data) {
        const previousState = this._fetchPreviousState()
        if (!hashCompare(data, previousState.content)) return;
        const previousUpdateInfo = this._fetchPreviousUpdateInfo()
        return [
            await this._uploadState(this.timestamp, previousState.sha, data),
            await this._uploadUpdateInfo(this.timestamp, previousUpdateInfo.sha)
        ];
    }

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
        state.data.content = state.data.content.replace(/\n/g, "")
        return state.data;
    }

    _getPreviousUpdateInfo() {
        const route = `GET /repos/{owner}/{repo}/contents/update.json`;
        const options = {owner: this.owner, repo: this.repository};
        return this.octokit.request(route, options);
    }

    _getPreviousState() {
        const route = `GET /repos/{owner}/{repo}/contents/state.json`;
        const options = {owner: this.owner, repo: this.repository};
        return this.octokit.request(route, options);
    }

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

    _uploadState(timestamp, previousSha, data) {
        const route = `PUT /repos/{owner}/{repo}/contents/state.json`;
        const options = {
            owner: this.owner,
            repo: this.repository,
            content: encode(data),
            sha: previousSha,
            message: `State #${timestamp}`,
        };
        return this.octokit.request(route, options);
    }
}
