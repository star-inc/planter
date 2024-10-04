import {
    ping as taskPing,
} from "./ping";

const scheduled = (...args) => {
    const [_event, _env, ctx] = args;
    const tasks = [taskPing];
    const promises = Promise.
        allSettled(tasks.map((c) => c(...args))).
        then((m) => console.info(m)).
        catch((e) => console.error(e));
    ctx.waitUntil(promises);
};

export default {
    scheduled
};
