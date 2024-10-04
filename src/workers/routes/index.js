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
    const details = content.get("details");

    const turnstileToken = content.get("cf-turnstile-response");
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    const connectingIp = headers.get('CF-Connecting-IP') || "127.0.0.1";

    if (!title || !type || !details || !turnstileToken) {
        return new Response("Bad Request", {
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
        return new Response("Forbidden", {
            status: StatusCodes.FORBIDDEN,
        });
    }

    const mailer = await import("@sendgrid/mail");
    mailer.setApiKey(env.MAIL_SENDGRID_API_KEY);
    try {
        const from = env.MAIL_REPORT_SENDER;
        const to = env.MAIL_REPORT_RECEIVER;
        const subject = `Status Issue - [${type}] ${title}`;
        const text = `Title: ${title}\n` +
            `Type: ${type}\n` +
            `IP Address: ${connectingIp}\n\n` +
            `${details}\n`;
        const message = { from, to, subject, text };
        await mailer.send(message);
    } catch (e) {
        console.error(e);
    }

    return new Response("Accepted", {
        status: StatusCodes.ACCEPTED,
    });
});

export default router;
