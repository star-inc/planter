import {
    AutoRouter,
    cors,
    withContent,
} from "itty-router";

import {
    StatusCodes,
} from "http-status-codes";

import {
    validResponse,
} from "../clients/turnstile";

const redirectCodes = [
    StatusCodes.MOVED_TEMPORARILY,
    StatusCodes.MOVED_PERMANENTLY,
    StatusCodes.TEMPORARY_REDIRECT,
    StatusCodes.PERMANENT_REDIRECT,
];
const issueTypes = [
    "Site Down",
    "App Crashes",
    "Network Issues",
    "Domain/DNS Issues",
    "TLS/SSL Issues",
    "Resource Missing",
    "Report Phishing/Malware",
    "Other/Unknown"
];

const {
    preflight: preCorsify,
    corsify,
} = cors();
const endCorsify = (...args) => {
    const [res] = args;
    if (redirectCodes.includes(res?.status)) {
        return res;
    }
    return corsify(...args)
};

const router = AutoRouter({
    before: [preCorsify],
    finally: [endCorsify],
});

router.get("/", (_, env) => {
    const dstUrl = env.PAGE_ORIGIN;
    const statusCode = 301;
    return Response.redirect(dstUrl, statusCode);
});

router.get("/nodes", async (_, env) => {
    const stmt = env.DB.prepare(
        "SELECT nodes.id, nodes.name, nodes.description, nodes.httpVisible, nodes.httpStatus, nodes.httpUrl, nodeLinks.parentNodeId AS parentId, nodeTypes.id AS typeId, nodeTypes.name AS typeName, nodeTypes.description AS typeDescription, nodeTypes.priorityClass AS typePriority FROM nodes LEFT JOIN nodeLinks ON nodes.id = nodeLinks.childNodeId LEFT JOIN nodeTypes ON nodes.type = nodeTypes.id GROUP BY nodes.id",
    );
    const { results } = await stmt.all();
    const updatedAt = await env.KV.get("pingUpdatedAt");
    return {
        nodes: results.map((i) => ({
            name: i.name,
            description: i.description,
            typeId: i.typeId,
            linkId: i.id,
            httpStatus: i.httpStatus,
            httpUrl: i.httpVisible ? i.httpUrl : null,
        })),
        types: Object.fromEntries(
            results.
                filter((i) => i.typeId !== null).
                map((i) => ([i.typeId, {
                    name: i.typeName,
                    description: i.typeDescription,
                    priority: i.typePriority,
                }])),
        ),
        links: results.
            filter((i) => i.parentId !== null).
            reduce((i, j) => ({
                ...i,
                [j.parentId]: [...(i[j.parentId] || []), j.id],
            }), {}),
        updatedAt,
    };
});

router.post("/issues", withContent, async (req, env) => {
    const { content, headers } = req;

    const title = content.get("title");
    const type = content.get("type");
    const contact = content.get("contact");
    const details = content.get("details");

    const turnstileToken = content.get("cf-turnstile-response");
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    const connectingIp = headers.get('CF-Connecting-IP') || "127.0.0.1";

    if (!title || !type || !contact || !details || !turnstileToken) {
        return new Response("Empty Fields", {
            status: StatusCodes.BAD_REQUEST,
        });
    }

    if (!issueTypes.includes(type)) {
        return new Response("Invalid Type", {
            status: StatusCodes.BAD_REQUEST,
        });
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(contact)) {
        return new Response("Invalid Contact", {
            status: StatusCodes.BAD_REQUEST,
        });
    }

    const {
        success: turnstileSuccess,
    } = await validResponse({
        turnstileToken,
        turnstileSecret,
        connectingIp,
    });
    if (!turnstileSuccess) {
        return new Response("Invalid Turnstile", {
            status: StatusCodes.FORBIDDEN,
        });
    }

    const mailer = await import("@sendgrid/mail");
    mailer.setApiKey(env.MAIL_SENDGRID_API_KEY);
    try {
        const from = env.MAIL_REPORT_SENDER;
        const to = env.MAIL_REPORT_RECEIVER;

        const subject = `Status Issue - [${type}] ${title}`;
        const text = `Issue Title: ${title}\n` +
            `Issue Type: ${type}\n\n` +
            `Source Address: ${connectingIp}\n` +
            `Source Contact: ${contact}\n\n` +
            `${details}\n`;

        const message = { from, to, subject, text };
        await mailer.send(message);
    } catch (e) {
        console.error(e);
    }

    return new Response("Thank you!", {
        status: StatusCodes.ACCEPTED,
    });
});

export default router;
