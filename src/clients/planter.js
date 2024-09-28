import ky from "ky";

const {
    VITE_APP_WORKER_BASE_URL: prefixUrl,
} = import.meta.env;

export const client = ky.extend({
  prefixUrl,
});
