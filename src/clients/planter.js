import ky from "ky";

const {
    VITE_APP_WORKER_BASE_URL: baseUrl,
} = import.meta.env;

export const usePlanterClient = () => ky.create({
    prefixUrl: baseUrl,
});
