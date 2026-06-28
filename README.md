# Planter - Star Inc. System Status

Planter is a system status dashboard designed for Star Inc.

Built on Nuxt and Cloudflare (Pages, Workers, D1 Database, KV), it features automated system checking (Ping), node dependency mapping, and an issue reporting page protected by Cloudflare Turnstile.

---

## Features

- Status Dashboard: Displays the HTTP status of monitored nodes (Operational, Partial Outage, Major Outage).
- Automated Health Checks: Uses Cloudflare Cron Triggers and Nitro Tasks to test node HTTP endpoints periodically and update the D1 database.
- Node Dependencies: Supports parent-child relationships between nodes (nodeLinks).
- Issue Reporting: Allows users to report issues via the /raise page, secured by Cloudflare Turnstile and notified via SendGrid emails.

---

## Tech Stack

- Frontend & API Framework: Nuxt (Future Mode)
- UI Library: Nuxt UI
- Runtime Environment: Cloudflare Pages / Workers
- Database & Storage: Cloudflare D1, Cloudflare KV
- Bot Protection: Cloudflare Turnstile
- Email Service: SendGrid Web API
- Package Manager: Bun

---

## Project Structure

```txt
├── app/                  # Frontend application
│   ├── components/       # Shared UI components
│   ├── pages/            # Page routing and views
│   └── assets/           # Static assets and CSS
├── server/               # Backend API and background tasks
│   ├── api/              # API endpoints
│   └── tasks/            # Cron tasks (Ping checks)
├── initialize.sql        # SQL script to set up D1 schema
├── wrangler.jsonc        # Cloudflare Wrangler configuration
└── package.json          # Package dependencies and scripts
```

---

## Local Development

### 1. Install Dependencies

```bash
bun install
```

### 2. Initialize Local Database

```bash
bunx wrangler d1 migrations apply planter --local
```

### 3. Run Development Server

```bash
bun run dev
```

To build and preview the application locally using the Cloudflare emulator (Miniflare):

```bash
bun run preview
```

---

## Deployment

### 1. Provision Cloudflare Resources

Create a D1 Database and a KV Namespace in your Cloudflare dashboard, and update their respective IDs in wrangler.jsonc.

Initialize the remote database:

```bash
bunx wrangler d1 migrations apply planter --remote
```

### 2. Set Up Environment Variables

To generate a secure token/passphrase for the `healthzPass` database column, we recommend running:

```bash
openssl rand -base64 32
```

Configure the following variables in the Cloudflare dashboard or via Wrangler:

#### Variables (Vars)

- PAGE_ORIGIN: The domain origin of the status page.
- MAIL_REPORT_SENDER: The sender email address.
- MAIL_REPORT_RECEIVER: The receiver email address for alerts.

#### Secrets

- TURNSTILE_SECRET_KEY: Cloudflare Turnstile secret key.
- MAIL_SENDGRID_API_KEY: SendGrid API key.

### 3. Deploy

```bash
bun run deploy
```

---

## License

This project is licensed under the MIT License.
