import {
  AutoRouter,
  cors,
} from "itty-router";

const redirectCodes = [301, 302, 307, 308];

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

router.
  get("/", (_, env) => {
    const dstUrl = env.PAGE_ORIGIN;
    const statusCode = 301;
    return Response.redirect(dstUrl, statusCode);
  }).
  get("/nodes", async (_, env) => {
    const stmt = env.DB.prepare(
      "SELECT nodes.id, nodes.type, nodes.displayName, nodes.httpUrl, nodes.httpStatus, COUNT(services.id) AS serviceCount FROM nodes LEFT JOIN services ON nodes.id = services.nodeId",
    );
    const { results } = await stmt.all();
    return results;
  }).
  get("/nodes/:nodeId", async (req, env) => {
    const { nodeId } = req;
    const stmt = env.DB.prepare(
      "SELECT id, displayName, httpUrl, httpStatus FROM services WHERE nodeId = ?",
    ).bind(nodeId);
    const { results } = await stmt.all();
    return results;
  });

const pingNodes = async (_, env) => {
  const stmt = env.DB.prepare(
    "SELECT id, httpUrl FROM nodes",
  );
  const { results } = await stmt.all();
  await Promise.allSettled(
    results.map(async ({ id, httpUrl }) => {
      const {
        status: httpStatus,
      } = await fetch(httpUrl);
      const stmt = env.DB.prepare(
        "UPDATE nodes SET httpStatus = ? WHERE id = ?",
      ).bind(httpStatus, id);
      await stmt.run();
    })
  );
};

const pingServices = async (_, env) => {
  const stmt = env.DB.prepare(
    "SELECT * FROM services",
  );
  const { results } = await stmt.all();
  await Promise.allSettled(
    results.map(async ({ id, httpUrl }) => {
      const {
        status: httpStatus,
      } = await fetch(httpUrl);
      const stmt = env.DB.prepare(
        "UPDATE services SET httpStatus = ? WHERE id = ?",
      ).bind(httpStatus, id);
      await stmt.run();
    })
  );
};

const scheduled = async (...args) => {
  const [_req, _env, ctx] = args;
  const handlers = [pingNodes, pingServices];
  const lifeCycle = Promise.all(
    handlers.map((c) => c(...args)),
  );
  ctx.waitUntil(lifeCycle);
};

export default {
  ...router,
  scheduled,
};
