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
      "SELECT nodes.id, nodes.name, nodes.description, nodes.httpVisible, nodes.httpStatus, nodes.httpUrl, nodeLinks.parentNodeId AS parentId, nodeTypes.id AS typeId, nodeTypes.name AS typeName, nodeTypes.priorityClass AS typePriority FROM nodes LEFT JOIN nodeLinks ON nodes.id = nodeLinks.childNodeId LEFT JOIN nodeTypes ON nodes.type = nodeTypes.id GROUP BY nodes.id",
    );
    const { results } = await stmt.all();
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
            priority: i.typePriority,
          }]))
      ),
      links: results.
        filter((i) => i.parentId !== null).
        reduce((i, j) => ({
          ...i,
          [j.parentId]: [...(i[j.parentId] || []), j.id],
        }), {}),
    };
  });

const scheduled = async (_event, env, ctx) => {
  const stmt = env.DB.prepare(
    "SELECT id, httpUrl FROM nodes",
  );
  const { results } = await stmt.all();
  const pingPromise = await Promise.allSettled(
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
  ctx.waitUntil(pingPromise);
};

export default {
  ...router,
  scheduled,
};
