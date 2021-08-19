import providerInterface from "./interface";
import {Octokit} from "@octokit/core";
import {createAppAuth} from "@octokit/auth-app";
import {sha256} from "js-sha256";

const {encode} = require("js-base64");

export default class extends providerInterface {
    constructor() {
        super();
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
        let previousState;
        try {
            previousState = await this._getPreviousState();
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
    }

    async newState(timestamp, data, previousStateSha = null) {
        let previousUpdateInfo;
        try {
            previousUpdateInfo = await this._getPreviousUpdateInfo();
        } catch (e) {
            console.warn(e);
            previousUpdateInfo = {data: {sha: null}};
        }
        if (!("data" in previousUpdateInfo)) process.exit(1);
        if (!("sha" in previousUpdateInfo.data)) process.exit(1);
        const previousUpdateInfoSha = previousUpdateInfo.data.sha;
        return [
            await this._uploadUpdateInfo({timestamp}, previousUpdateInfoSha),
            await this._uploadState(timestamp, data, previousStateSha)
        ];
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

    _uploadUpdateInfo(info, previousSha = null) {
        const route = `PUT /repos/{owner}/{repo}/contents/update.json`;
        const options = {
            owner: this.owner,
            repo: this.repository,
            content: encode(JSON.stringify(info)),
            sha: previousSha,
            message: `UpdateInfo #${info.timestamp}`,
        };
        return this.octokit.request(route, options);
    }

    _uploadState(timestamp, data, previousSha = null) {
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
