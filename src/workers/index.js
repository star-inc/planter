import {
  AutoRouter,
  cors,
} from "itty-router";

const redirectCodes = [301, 302, 307, 308];

const { preflight, corsify } = cors();
const precorsify = (...args) => {
  const [res] = args;
  if (redirectCodes.includes(res?.status)) {
    return res;
  }
  return corsify(...args)
}
const router = AutoRouter({
  before: [preflight],
  finally: [precorsify],
});

router.
  get("/", (_, env) => {
    const dstUrl = env.PAGE_ORIGIN;
    const statusCode = 301;
    return Response.redirect(dstUrl, statusCode);
  }).
  get("/states", () => {
    return "Loaded";
  }).
  get("/states/:id", ({ id }) => {
    return id;
  });

export default router;
