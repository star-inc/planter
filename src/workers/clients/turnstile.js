import ky from "ky";

export async function validResponse({ turnstileToken, turnstileSecret, connectingIp }) {
    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    const body = new FormData();
    body.set("response", turnstileToken);
    body.set("secret", turnstileSecret);
    body.set("remoteip", connectingIp);

    try {
        return await ky.
            post(url, { body }).
            json();
    } catch (e) {
        return {
            success: false,
            ...e,
        }
    }
};
