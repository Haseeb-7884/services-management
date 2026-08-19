# Requirements Status — Creator Hub (MERN Rebuild)

Audited against `docs/PRD-MERN-Migration.md`'s phased roadmap (section 8) and cross-cutting sections (tech stack, security, non-functional requirements), checked against the actual code as of 2026-08-14.

Legend: ✅ Done · 🟡 Partial (started, not complete) · ⬜ Pending (not started)

---

## Phase 0 — Foundation

- Repo scaffold (client/server, TypeScript both sides) — ✅ Done
- Register — ✅ Done
- Login — ✅ Done
- Email verification (real send) — ⬜ Pending (accounts are auto-verified as a placeholder; no email is actually sent)
- Forgot / reset password — ⬜ Pending (validation schemas exist, but no routes or controllers were ever built)
- 2FA (TOTP) — ⬜ Pending (schema field reserved on User, no setup/verify flow or UI)
- Role/permission middleware (`requireRole`, `requirePermission`) — ✅ Done
- Dynamic branding pipeline (SiteConfig + Owner theme editor) — ✅ Done
- Core MongoDB models — ✅ Done (User, Video, Image, Article, Follow, Comment, Like, Notification, Conversation/Message, SubscriptionPlan, SiteConfig)
- Base layout consuming the theme (CSS vars, Navbar/Footer) — ✅ Done

## Phase 1 — Core content + social MVP

- Video upload/playback — ✅ Done (Cloudinary storage, custom branded player)
- Image upload/gallery — ✅ Done (dedicated image detail page added this session — `/images/:id` no longer 404s)
- Public profiles / channel pages — ✅ Done (incl. tagline, content category, and social links)
- Follow / unfollow — ✅ Done
- Like (videos, images, articles) — ✅ Done
- Comment, incl. threaded replies — ✅ Done (Article comments/likes wired to the same UI as Video/Image this session)
- Activity feed — ✅ Done (as of this session: `/feed` merges approved Video/Image/Article, `/feed/trending` ranks by an engagement-vs-age score, Home page is fully dynamic)
- In-app notifications — ✅ Done (real, auto-created on follow/like/comment)
- Real-time push for notifications/messages — 🟡 Partial (Socket.io server is running and accepts connections, but no feature actually emits through it yet — everything is REST + polling)
- Global search — ⬜ Pending (each content type supports its own scoped text search; no unified `/search` endpoint)

## Phase 2 — Expanded content types

- Shorts — 🟡 Partial (videos have an `isShort` flag and can be filtered, but there's no dedicated Shorts feed module as scoped)
- Articles — 🟡 Partial (full CRUD + cover image + likes/comments works, and this session added the missing upload UI, detail page, and list page that make it actually usable end to end; body is still plain text, not rich text)
- SEO (meta tags, Open Graph, sitemap, robots.txt) — 🟡 Partial (added this session: per-page title/meta description/OG/Twitter-card tags via a lightweight `useSeo` hook, dynamic `/sitemap.xml` + `/robots.txt`, Owner-editable SEO defaults in the branding dashboard. Not done: this only works for JS-executing crawlers since there's no SSR/prerendering yet - see the caveat in `API-REFERENCE.md`'s SEO section; also no per-video/article structured data (JSON-LD) yet)
- 24h Stories — ⬜ Pending (no model, endpoints, or UI at all)

## Phase 3 — Monetization

- Subscription plan catalog (CRUD, seeded plans) — ✅ Done
- Pricing page wired to real plans — ✅ Done (as of this session; CTA buttons route to sign-up since there's no checkout yet - see Stripe/PayPal below)
- Stripe / PayPal integration — ⬜ Pending (not started, no payment provider dependencies installed)
- Creator dashboard (stats, content list) — ✅ Done (rebuilt this session on real `/dashboard/stats` and `/dashboard/content` data: real totals, real content mix, top-performing content, moderation status breakdown, real recent-followers list. No day-by-day trend chart - see Known Limitations in API-REFERENCE.md)
- Premium gating tied to an actual purchase — ⬜ Pending (role/permission tiers exist, but nothing currently upgrades a user's plan/role after a "purchase" since there's no payment flow)

## Phase 4 — Admin / Owner / Moderation

- Owner branding dashboard — ✅ Done
- Role hierarchy with real teeth (Owner → Admin → Moderator → Creator) — ✅ Done (as of this session). Owner is a single fixed account, not an assignable role — it already holds full authority, so there's no separate "Super Admin" tier anyone can be promoted into.
- Admin dashboard (limited access, content moderation only) — ✅ Done
- Owner dashboard (user directory, Admin slot management, Creator grant/revoke, moderation) — ✅ Done
- Admin slots capped at 5, assigned/revoked by Owner only, revoke restores previous role — ✅ Done
- Content moderation queue (approve/reject) — ✅ Done (creator/premium/standard uploads now default to `pending`; Moderator+ uploads still auto-publish)
- Reports pipeline (users reporting a specific post, distinct from the moderation queue) — ⬜ Pending (no Report model or endpoints)
- Site-wide analytics dashboards (traffic/revenue) — ⬜ Pending (only per-creator stats and the Owner overview counts exist, no traffic/revenue analytics)
- Admin activity audit log — ⬜ Pending

## Phase 5 — Hardening & future-ready (explicitly backlog in the PRD, not MVP)

- 2FA rollout — ⬜ Pending
- Redis-backed rate limiting / caching — ⬜ Pending (currently in-memory `express-rate-limit`, fine for one instance, won't hold up multi-instance)
- AI recommendations — ⬜ Pending (explicitly backlog)
- Multi-language — ⬜ Pending (explicitly backlog)
- Referral system — ⬜ Pending (explicitly backlog)
- Sponsored content — ⬜ Pending (explicitly backlog)

---

## Cross-cutting: tech stack from PRD section 1

- React + Vite + Tailwind + React Router — ✅ Done
- TanStack Query — 🟡 Partial (installed, provider wraps the app, but no page actually uses `useQuery`/`useMutation` yet — all data fetching is manual `useEffect` + axios)
- Zustand — ✅ Done (auth token store)
- Socket.io — 🟡 Partial (see Phase 1 note above)
- Node/Express under `/api/v1` — ✅ Done
- MongoDB Atlas + Mongoose — ✅ Done
- JWT (access + rotating refresh) + bcrypt — ✅ Done
- Cloudinary media storage — ✅ Done (as of this session; chunked upload for large video)
- Redis (cache/queue) + BullMQ — ⬜ Pending
- Stripe + PayPal — ⬜ Pending
- Email (Resend/SendGrid) — ⬜ Pending
- MongoDB Atlas Search / Meilisearch — ⬜ Pending (basic Mongo `$text` index only, scoped per content type)
- Deployment (frontend/backend hosted separately) — ⬜ Pending (local dev only so far)

## Security checklist (PRD section 6)

- httpOnly refresh cookie, `secure` flag in production — ✅ Done
- JWT rotation (`refreshTokenVersion`) — ✅ Done
- TOTP 2FA — ⬜ Pending
- Device/session list with revoke — ⬜ Pending
- Login rate limiting — 🟡 Partial (in-memory, not Redis-backed)
- CSRF token on state-changing posts — ⬜ Pending
- Helmet + CSP headers — 🟡 Partial (Helmet defaults on, no custom CSP policy configured)
- Input sanitization (XSS) — 🟡 Partial (Zod validates shape/type on JSON routes; no dedicated HTML sanitizer for free-text fields)
- Mongoose schema validation — ✅ Done
- File-type/size validation on upload — ✅ Done
- Virus scan hook on upload — ⬜ Pending
- Spam/abuse heuristics on comments — ⬜ Pending
- Admin activity audit log — ⬜ Pending

## Non-functional requirements (PRD section 7)

- Mobile-first responsive UI — ✅ Done
- Code-split routes — ⬜ Pending (single JS bundle, ~540KB — Vite's build warns about this)
- Image/video CDN delivery — ✅ Done (via Cloudinary)
- Redis-cached feeds/config — ⬜ Pending
- Horizontally-scalable stateless Express — 🟡 Partial (JWT auth is stateless-friendly; in-memory rate limiter and local-disk upload fallback are not multi-instance-safe)
- Structured logging — 🟡 Partial (HTTP request logs via morgan only, no structured app-level logger)
- Health-check endpoint — ✅ Done (`/api/v1/health`)

---

## Fixed this session (previously tracked as gaps)

- `ImageCard` linked to `/images/:id` with no matching route - fixed, `ImageDetail.tsx` now exists.
- No article detail page/route existed - fixed, `ArticleDetail.tsx` + `ArticleFeed.tsx` (`/articles`) now exist, and the Upload page gained a third "article" tab (previously articles had a backend API but zero way to create one from the UI).
- Home page, Video Feed, Image Gallery, Pricing, and the entire Creator Dashboard were still rendering `client/src/data/mockContent.ts` dummy data - all switched to real API calls this session; the mock data file has been deleted.
- Several dead buttons that looked functional but had no handler: "Follow"/"Share"/comment-count on the video detail page, the Save/Bookmark button (removed - no backend exists for it, better than a fake button), and the Edit button in the dashboard content table (removed for the same reason; only Delete is wired to a real endpoint).
- `AuthCard`'s login/register side panel claimed "Joined by 2.4M+ creators" - replaced with real featured-creator avatars and non-fabricated copy.

## Known gaps still open

- Forgot/reset-password zod schemas exist in `auth.validators.ts` but are dead code — no route ever wires them up.
- No content-edit flow exists (title/caption/body can't be changed after upload) - only delete.
- No client-side route code-splitting yet - the production JS bundle is ~578KB (Vite warns above 500KB). Fine at current scale; worth revisiting with `React.lazy()` per route before this grows much further.

## What's explicitly out of scope for now

- Structured data (JSON-LD) and true SSR/prerendering for SEO - base meta/OG tags and sitemap are done (see Phase 2 SEO line above); this deeper layer isn't.
- Ad placement/infrastructure - not started.
- Payment checkout (Stripe/PayPal) - plans are real, but there's no purchase flow yet.
