# Social Content & Video Sharing Platform (MERN)

A social/content platform (videos, shorts, images, follows, likes, comments) with
fully dynamic, database-driven branding — no site name, logo, favicon, or theme
color is hardcoded anywhere in the app. This replaces the previous PHP
(`DigiScale`) codebase; see [`docs/PRD-MERN-Migration.md`](docs/PRD-MERN-Migration.md)
for the full product spec, data model, API map, and phased roadmap.

**Current build phase:** Phase 0 + 1 — auth, roles, dynamic branding, video/image
upload & playback, profiles, follow, likes, comments. Shorts, articles, stories,
subscriptions/payments, and the admin/owner moderation dashboards are scaffolded
in the data model and role system but not yet built out (see roadmap in the PRD).

## Stack

- **Client:** React 19 + Vite + TypeScript + Tailwind CSS v4, React Router, TanStack Query, Zustand, Axios
- **Server:** Node.js + Express + TypeScript, Mongoose (MongoDB), JWT auth, Socket.io, Multer + Cloudinary
- **Database:** MongoDB Atlas

## Project layout

```
client/   React frontend (Vite)
server/   Express API
docs/     PRD and supporting docs
```

## Getting started

### 1. Prerequisites
Node 18+, a MongoDB Atlas cluster (see "MongoDB setup" below), and optionally a
free Cloudinary account for media storage (uploads fall back to local disk under
`server/uploads/` if Cloudinary isn't configured, so you can develop without it).

### 2. Server + client together (recommended)

Once both `.env` files exist (see steps below the first time), you can run
everything with one command from the repo root:

```bash
npm run install:all   # installs server/ and client/ dependencies
npm run seed           # creates the Owner account + default branding document
npm run dev             # runs server (:5000) and client (:5173) together
```

`npm run dev` at the root uses `concurrently` to start both dev servers in one
terminal, color-coded `server`/`client`. Ctrl+C stops both.

### 2b. Server and client separately

Useful the first time (so you can fill in `.env` for each), or if you'd rather
see each app's logs in its own terminal.

**Server** — terminal 1:

```bash
cd server
npm install
cp .env.example .env   # fill in MONGODB_URI at minimum
npm run seed            # creates the Owner account + default branding document
npm run dev              # http://localhost:5000
```

The seed script creates the single **Owner** account from `OWNER_EMAIL` /
`OWNER_PASSWORD` / `OWNER_USERNAME` in `.env`. Log in with those credentials,
then change the password from the profile page — there's no separate "make
someone an owner" endpoint, by design (see role rules in the PRD).

**Client** — terminal 2:

```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL, defaults to http://localhost:5000/api/v1
npm run dev              # http://localhost:5173
```

### 3. MongoDB setup

In Atlas: **Connect to Cluster0 → Drivers → Node.js**, copy the connection
string, and create a dedicated database user (Database Access tab) with
`readWrite` rather than using your personal Atlas login. Under Network Access,
allow `0.0.0.0/0` for now (fine pre-production; tighten once you know your
hosting provider's static egress IPs, if any). Paste the string into
`server/.env` as `MONGODB_URI`, replacing `<password>` and the database name.

## Branding / theming

Everything brand-related lives in the `SiteConfig` Mongo document, edited from
`/owner/branding` (Owner role only) and read by the client on boot via
`GET /api/v1/config/branding`. The client applies it as CSS custom properties
(`--brand-primary`, `--brand-bg-start`, etc. — see `client/src/index.css` and
`client/src/context/BrandingContext.tsx`). To rebrand the site, log in as
Owner and use that page — never edit color/name literals in component code.

## Role-based access

Seven roles (Owner → Super Admin → Admin → Moderator → Creator → Premium →
Standard), enforced by `server/src/middleware/rbac.ts` against the capability
map in `server/src/constants/roles.ts`. The Owner role is created once by the
seed script and cannot be edited, suspended, or demoted by any other account —
this is enforced by never exposing that role as an option in the (not-yet-built)
admin user-management UI, and should stay that way when Phase 4 adds it.

## Deployment

Client and server deploy **separately** — see section 9 of the PRD for the
full rationale and required environment variables:

- `client/` → Vercel or Netlify (static Vite build)
- `server/` → Render, Railway, or Fly.io (needs a persistent Node process for
  Socket.io and uploads — Vercel/Netlify serverless functions are not a good
  fit for this)
- Both point at the same MongoDB Atlas cluster

## Known TODOs before production

- `multer` is currently pinned to the 1.x line; upgrade to 2.x (patches known
  vulnerabilities) before going live — see `server/package.json`.
- Email verification is stubbed (`auth.controller.ts` auto-verifies on
  register); wire up a real provider (Resend/SendGrid) before launch.
- File uploads aren't virus-scanned yet (flagged in the PRD security checklist).
- Rate limiting is IP-based via `express-rate-limit` in-memory; move to a
  Redis store before running more than one server instance.
