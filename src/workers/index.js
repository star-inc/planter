import {
  AutoRouter,
  cors,
} from "itty-router";

const { preflight, corsify } = cors();
const router = AutoRouter({
  before: [preflight],
  finally: [corsify],
});

router.
  get("/", (_, env) => {
    const dstUrl = env.PAGE_ORIGIN;
    const statusCode = 301;
    return Response.redirect(dstUrl, statusCode);
  }).
  get("/states/:id", ({ id }) => {
    return id;
  });

export default router;
