import {
  defineEventHandler,
  createError,
  readFormData,
  getRequestHeader,
  setResponseStatus,
  setResponseHeaders,
} from 'h3';
import type {H3Event} from 'h3';

const issueTypes = [
  'Site Down',
  'App Crashes',
  'Network Issues',
  'Domain/DNS Issues',
  'TLS/SSL Issues',
  'Resource Missing',
  'Report Phishing/Malware',
  'Other/Unknown',
];

export default defineEventHandler(async (event: H3Event) => {
  const cloudflare = event.context.cloudflare;
  if (!cloudflare || !cloudflare.env) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudflare Workers environment is not available',
    });
  }

  const {
    TURNSTILE_SECRET_KEY: turnstileSecret,
    MAIL_SENDGRID_API_KEY: sendgridApiKey,
    MAIL_REPORT_SENDER: fromEmail,
    MAIL_REPORT_RECEIVER: toEmail,
  } = cloudflare.env;

  const formData = await readFormData(event);

  const title = formData.get('title') as string;
  const type = formData.get('type') as string;
  const contact = formData.get('contact') as string;
  const details = formData.get('details') as string;
  const turnstileToken = formData.get('cf-turnstile-response') as string;

  const connectingIp =
    getRequestHeader(event, 'cf-connecting-ip') || '127.0.0.1';

  if (!title || !type || !contact || !details || !turnstileToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Empty Fields',
    });
  }

  if (!issueTypes.includes(type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Type',
    });
  }

  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(contact)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Contact',
    });
  }

  // Verify Turnstile Token
  const verificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const verificationBody = new URLSearchParams();
  verificationBody.append('response', turnstileToken);
  verificationBody.append('secret', turnstileSecret || '');
  verificationBody.append('remoteip', connectingIp);

  try {
    const verifyRes = await fetch(verificationUrl, {
      method: 'POST',
      body: verificationBody,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const verifyJson = await verifyRes.json() as {success: boolean};
    if (!verifyJson.success) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Invalid Turnstile',
      });
    }
  } catch (err) {
    throw createError({
      statusCode: 403,
      statusMessage: (err as {message?: string}).message || 'Invalid Turnstile',
    });
  }

  const id = crypto.randomUUID();
  const date = new Date().toISOString();

  // Send Email via SendGrid Web API
  if (sendgridApiKey) {
    try {
      const subject = `Status Issue - [${type}] ${title}`;
      const text =
        '[Issue]\n' +
        `Title: ${title}\n` +
        `Type: ${type}\n` +
        `ID: ${id}\n` +
        '---\n[Source]\n' +
        `Date: ${date}\n` +
        `Address: ${connectingIp}\n` +
        `Contact: ${contact}\n` +
        '---\n\n' +
        `${details}\n`;

      const sendgridUrl = 'https://api.sendgrid.com/v3/mail/send';
      const sendgridResponse = await fetch(sendgridUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendgridApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{email: toEmail || 'noreply@status.starinc.xyz'}],
            },
          ],
          from: {email: fromEmail || 'noreply@status.starinc.xyz'},
          subject: subject,
          content: [
            {
              type: 'text/plain',
              value: text,
            },
          ],
        }),
      });

      if (!sendgridResponse.ok) {
        const errorText = await sendgridResponse.text();
        console.error('SendGrid error:', errorText);
      }
    } catch (e) {
      console.error('Failed to send SendGrid email:', e);
    }
  } else {
    console.warn(
        'MAIL_SENDGRID_API_KEY is not defined. Skipping email sending.',
    );
  }

  // Set response headers and return accepted status
  setResponseStatus(event, 202);
  setResponseHeaders(event, {
    'x-planter-issue-id': id,
    'x-planter-source-ip': connectingIp,
    'x-planter-source-contact': contact,
  });

  return 'Thank you!';
});
