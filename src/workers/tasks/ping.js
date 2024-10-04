import ky from "ky";

const client = ky.extend({
    headers: {
        "User-Agent": "Planter/1.0",
    },
});

export const ping = async (_event, env, _ctx) => {
    const stmt = env.DB.prepare(
        "SELECT id, httpUrl FROM nodes",
    );
    const { results } = await stmt.all();
    await Promise.allSettled(
        results.map(async ({ id, httpUrl }) => {
            const {
                status: httpStatus,
            } = await client.get(httpUrl);
            const stmt = env.DB.prepare(
                "UPDATE nodes SET httpStatus = ? WHERE id = ?",
            ).bind(httpStatus, id);
            await stmt.run();
        })
    );
    const updatedAt = new Date().toISOString();
    await env.KV.put("pingUpdatedAt", updatedAt);
};
