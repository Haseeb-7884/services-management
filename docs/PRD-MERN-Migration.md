# Product Requirements Document
## Social Content & Video Sharing Platform — MERN Rebuild

**Status:** Draft v1 · **Prepared for:** client sign-off before development begins
**Supersedes:** the original `services-management` (DigiScale) PHP codebase, which was a social-media-growth-package storefront. This is a materially different product — a content/social platform (videos, shorts, images, articles, stories) with a creator economy and subscriptions. Treat this as a new build that happens to live in the same repository, not an incremental upgrade of DigiScale's business logic.

---

## 1. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React 18 + Vite, TailwindCSS, React Router, TanStack Query, Zustand | Tailwind lets theme tokens (colors, fonts) be driven entirely by CSS variables set at runtime from the Owner Dashboard — no hardcoded brand values in components |
| Realtime | Socket.io (client + server) | notifications, live comment counts, live view counts |
| Backend | Node.js + Express | REST API, versioned under `/api/v1` |
| Database | MongoDB Atlas + Mongoose | schemas in section 4 |
| Auth | JWT (short-lived access + rotating refresh token), bcrypt, TOTP-based 2FA | httpOnly cookie for refresh token |
| Media storage | Cloudinary (or S3 + CloudFront) | video transcoding/thumbnails, image optimization, signed uploads |
| Cache / queue | Redis | rate limiting, session/device tracking, feed caching, background jobs (BullMQ) for video processing & email |
| Payments | Stripe + PayPal SDKs | webhooks drive subscription state, not client confirmation |
| Email | Resend or SendGrid | verification, password reset, notification digests |
| Search | MongoDB Atlas Search (or Meilisearch if self-hosted) | full-text across users/videos/articles/tags |
| Deployment | React → Vercel/Netlify · Express → Render/Railway/Fly.io (separate service) | see section 9 |

Default assumption unless told otherwise: **TypeScript on both client and server** — flagged as an open decision below since it affects every file we write from day one.

---

## 2. Dynamic Branding (non-negotiable constraint)

Nothing brand-related is a literal string/hex code in source. A `SiteConfig` document in MongoDB (singleton, or versioned) holds:

- `siteName`, `logoUrl`, `faviconUrl`
- `theme.colors` (primary, secondary, background gradient stops, accent, text)
- `theme.fontFamily`
- `homepageLayout` (ordered array of section keys the homepage renders)
- `footerContent`, `seoDefaults`, `adSlots`

The frontend fetches `/api/v1/config/branding` on boot, injects the values as CSS custom properties (`--brand-primary`, etc.) and sets `<title>`/favicon/OG tags dynamically. The Owner Dashboard writes to this document; every save invalidates the CDN/Redis cache for that endpoint.

**Seed values (starting point only, fully editable):** carried over from the current DigiScale site so the new build doesn't look like a blank slate on day one — dark navy gradient background (`#0f1b2d → #1a2942`), white headings, muted slate subtext (`#94a3b8`), cyan/green accent CTAs, `Poppins` as the primary typeface. These are DB seed rows, not code constants.

---

## 3. Role Hierarchy & Permissions

| Role | Can | Cannot |
|---|---|---|
| **Owner** | Everything — branding, revenue, security, subscriptions, users, admins, DB, system config | Cannot be deleted, suspended, demoted, or edited by any other role |
| **Super Admin** | Manage admins/moderators/users/content, reports, categories, pages, analytics | Cannot touch Owner or Owner-level security controls |
| **Admin** | Manage users, moderate content, handle reports, manage categories/posts/videos | Cannot manage Owner or Super Admin |
| **Moderator** | Review/approve/reject content, remove violations, process reports | No user/role management |
| **Creator** | Upload content, creator dashboard, analytics, monetization program participation | No moderation/admin powers |
| **Premium User** | Premium features, higher upload limits, premium badge | No content-moderation powers |
| **Standard User** | Baseline platform access | Everything above |

Implementation: a `role` enum on `User` + a `permissions` capability map (not hardcoded `if (role === 'admin')` sprinkled through code) so Owner can, in principle, tune what a role can do without a redeploy. Express middleware (`requireRole`, `requirePermission`) guards every route; the same permission map drives what the React UI renders.

---

## 4. Core Data Models (Mongoose, abbreviated)

- **User** — email, username, passwordHash, role, profile{avatar, cover, bio}, followers/following counts, subscriptionPlan, twoFactor{enabled, secret}, isVerified, status
- **Video / Short** — owner, title, description, url, thumbnailUrl, durationSec, category, tags[], views, likes, isShort(bool) or separate collections, status(pending/approved/rejected)
- **Image** — owner, url, gallery/category, tags[]
- **Article** — owner, title, slug, richTextBody, coverImage, category, tags[], seo{metaTitle, metaDescription, canonicalUrl}
- **Story** — owner, mediaUrl, expiresAt (TTL index, 24h), viewers[]
- **Follow** — follower, following, createdAt
- **Comment** — author, targetType, targetId, body, parentComment (for replies)
- **Like / Reaction** — user, targetType, targetId, type
- **Notification** — recipient, actor, type, targetRef, read, createdAt
- **SubscriptionPlan** — name, price, interval, features[], isActive
- **Subscription** — user, plan, status, provider(stripe/paypal/manual), currentPeriodEnd
- **Payment** — user, amount, provider, status, invoiceUrl
- **Report** — reporter, targetType, targetId, reason, status, handledBy
- **SiteConfig** — as described in section 2
- **AdminActivityLog** — actor, action, target, timestamp, ip

---

## 5. Feature Modules → API Namespaces

| Module | Route prefix | Key endpoints |
|---|---|---|
| Auth | `/api/v1/auth` | register, login, refresh, logout, verify-email, forgot/reset-password, 2fa/setup, 2fa/verify |
| Users/Profiles | `/api/v1/users` | `/:username`, follow, followers, following, update-profile, avatar/cover upload |
| Videos | `/api/v1/videos` | CRUD, `/upload`, `/:id/like`, `/:id/comments`, `/:id/view` |
| Shorts | `/api/v1/shorts` | feed (cursor-paginated), CRUD, like/comment/share |
| Images | `/api/v1/images` | CRUD, gallery/category filters |
| Articles | `/api/v1/articles` | CRUD, slug lookup, SEO fields |
| Stories | `/api/v1/stories` | create, feed, `/:id/view` |
| Social | `/api/v1/feed`, `/notifications` | activity feed, notification list/read |
| Search | `/api/v1/search` | global + scoped (users/videos/articles/images/tags/categories) |
| Subscriptions | `/api/v1/subscriptions`, `/plans` | plan CRUD (owner), subscribe, cancel |
| Payments | `/api/v1/payments` | stripe/paypal webhooks, history, invoices, refunds |
| Creator | `/api/v1/creator` | dashboard stats, revenue, content analytics |
| Admin | `/api/v1/admin` | users, content moderation, reports, categories |
| Owner | `/api/v1/owner` | branding/theme, homepage layout, role management, system settings |
| Analytics | `/api/v1/analytics` | traffic, content, revenue, creator |

Every mutating route: input validation (Zod/Joi) → auth middleware → role/permission check → rate limiter → handler → activity log (for admin actions).

---

## 6. Security Checklist

HTTPS-only cookies, JWT rotation, TOTP 2FA, device/session list with revoke, login attempt rate limiting (Redis), CSRF token on state-changing form posts, Helmet + CSP headers, input sanitization (XSS), Mongoose schema validation + parameterized queries (no raw string concatenation — the old PHP `backend` class built SQL by string concat, which is exactly what to avoid this time), file-type/size validation + virus scan hook on upload, spam/abuse heuristics on comments, full admin activity audit log.

---

## 7. Non-Functional Requirements

Mobile-first responsive UI, code-split routes, image/video CDN delivery, Redis-cached feeds and config, horizontal-scalable stateless Express instances behind a load balancer (session state lives in Redis/JWT, not in-process), structured logging, health-check endpoint for the host's uptime monitor.

---

## 8. Phased Roadmap

Building the full spec (15+ subsystems including payments, real-time, moderation, analytics, and future AI/mobile items) in one pass isn't realistic. Proposed phasing — **needs your sign-off in section 10**:

- **Phase 0 — Foundation:** repo scaffold, auth (register/login/verify/reset/2FA), role/permission middleware, dynamic branding pipeline (SiteConfig + Owner theme editor), MongoDB models, base layout consuming the theme.
- **Phase 1 — Core content + social MVP:** video & image upload/playback, profiles, follow, like/comment, activity feed, notifications (in-app), global search.
- **Phase 2 — Expanded content types:** shorts feed, articles (rich text + SEO fields), 24h stories.
- **Phase 3 — Monetization:** subscription plans, Stripe/PayPal integration, creator dashboard, premium gating.
- **Phase 4 — Admin/Owner/Moderation:** full admin & owner dashboards, reports pipeline, moderation queue, analytics dashboards, activity logs.
- **Phase 5 — Hardening & future-ready:** 2FA rollout, DDoS/rate-limit tuning, AI recommendations, multi-language, referral system, sponsored content — these stay explicitly backlog, not MVP.

---

## 9. Deployment Architecture

React and Express are **deployed separately** — Vercel/Netlify are static/serverless hosts for the frontend build output; they are not a good fit for a long-running Express + Socket.io process handling uploads.

- **Frontend:** `client/` → Vercel (or Netlify) as a static Vite build. Set `VITE_API_URL` to the deployed backend URL.
- **Backend:** `server/` → Render, Railway, or Fly.io as a persistent Node service (keeps Socket.io connections alive, handles uploads/webhooks reliably). Set `CORS_ORIGIN` to the frontend's deployed URL, `MONGODB_URI`, `JWT_SECRET`, `STRIPE_*`, `CLOUDINARY_*`, `REDIS_URL`.
- **Database:** MongoDB Atlas, Network Access allowing the backend host's egress (or `0.0.0.0/0` for PaaS hosts with rotating IPs, secured by a strong DB-user password + IP-agnostic auth).
- Two separate deploy pipelines, one shared `.env.example` per service, CORS wired frontend→backend.

### What I need from your MongoDB Atlas screenshot
In the "Connect to Cluster0" modal: click **Drivers** → select **Node.js** as the driver/version → copy the connection string. It looks like:
`mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/<dbName>?retryWrites=true&w=majority`

Please create a **dedicated DB user** (Database Access tab) with `readWrite` on the target database rather than sharing your personal Atlas login, and confirm **Network Access** allows connections from `0.0.0.0/0` (fine for now since we're pre-production; we'll tighten later). Send me the connection string with a placeholder password — I'll store the real one only in a git-ignored `.env`, never committed.

---

## 10. Open Decisions Needed Before Coding Starts

1. **Existing PHP repo:** archive it alongside the new `client/`+`server/` folders in this same repo, delete it outright, or start the MERN app in a brand-new folder/repo entirely untouched?
2. **MVP scope:** which Phase 0/1 slice above should be the first working build?
3. **TypeScript vs JavaScript** for client and server.
