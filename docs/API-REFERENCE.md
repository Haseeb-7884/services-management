# Creator Hub API Reference

Base URL: `http://localhost:5000/api/v1`

Every response is wrapped the same way: `{ "success": boolean, "message": string, "data": ... }`.

Auth: send `Authorization: Bearer <accessToken>`. Get a token from Register or Login — both return `data.accessToken`. Tokens expire; call `POST /auth/refresh` (it reads the httpOnly refresh cookie Postman stores automatically) to get a new one.

Import `creator-hub.postman_collection.json` into Postman to test all of this directly — Login/Register requests auto-save the token into the collection so every other request is pre-authenticated.

## Auth

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/auth/register` | none | `{ username, email, password, displayName? }` |
| POST | `/auth/login` | none | `{ emailOrUsername, password }` |
| POST | `/auth/refresh` | refresh cookie | — |
| POST | `/auth/logout` | none | — |
| GET | `/auth/me` | required | — |

## Users

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/users/:username` | optional | — |
| GET | `/users/:username/followers?limit` | none | — each item includes `followedAt` |
| GET | `/users/:username/following` | none | — |
| GET | `/users/:username/content?type&page&limit` | none | — that user's approved Video/Image/Article, combined. `type` = `all`\|`video`\|`short`\|`image`\|`article` |
| PATCH | `/users/me` | required | `{ displayName?, bio?, tagline?, category?, socialLinks?: { website?, twitter?, instagram?, youtube? } }` |
| POST | `/users/me/avatar` | required | form-data: `avatar` (file) |
| POST | `/users/me/cover` | required | form-data: `cover` (file) |
| POST | `/users/:username/follow` | required | — |
| DELETE | `/users/:username/follow` | required | — |

## Videos

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/videos?page&limit&category&tag&search` | none | — |
| GET | `/videos/:id` | none | — (increments `views`) |
| POST | `/videos` | required, `upload_content` permission | form-data: `video` (file), `title`, `description?`, `category?`, `tags?` (comma-separated) — Moderator+ uploads auto-publish, everyone else's go to `pending` for Admin review. `thumbnailUrl` is now derived automatically from the uploaded video (Cloudinary frame-capture) - no separate thumbnail upload needed |
| DELETE | `/videos/:id` | required (owner or moderator+) | — |

## Images

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/images?page&limit&category&tag&search` | none | — |
| GET | `/images/:id` | none | — (increments `views`) |
| POST | `/images` | required, `upload_content` permission | form-data: `image` (file), `caption?`, `category?`, `tags?` — Moderator+ uploads auto-publish, everyone else's go to `pending` |
| DELETE | `/images/:id` | required (owner or moderator+) | — |

## Articles

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/articles?page&limit&category&tag&search` | none | — |
| GET | `/articles/:id` | none | — (increments `views`) |
| POST | `/articles` | required, `upload_content` permission | form-data: `cover?` (file), `title`, `excerpt?`, `body`, `category?`, `tags?` — Moderator+ uploads auto-publish, everyone else's go to `pending` |
| DELETE | `/articles/:id` | required (owner or moderator+) | — |

## Social (likes & comments)

Works polymorphically across `Video`, `Image`, and `Article` via `targetType`.

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/social/likes` | required | `{ targetType: "Video"\|"Image"\|"Article", targetId }` — toggles like on/off |
| GET | `/social/comments/:targetType/:targetId` | none | — |
| POST | `/social/comments` | required | `{ targetType, targetId, body, parentComment? }` |
| DELETE | `/social/comments/:id` | required (author or moderator+) | — |

Liking or commenting on someone else's content automatically creates a Notification for the owner.

## Notifications

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/notifications?page&limit` | required | — returns `{ items, total, unreadCount, page, pages }` |
| PATCH | `/notifications/:id/read` | required | — |
| PATCH | `/notifications/read-all` | required | — |

Created automatically on `follow`, `like`, and `comment` events — there's no manual-create endpoint by design.

## Messages

REST only in this pass — no Socket.io/real-time push yet (see Known Limitations below). The frontend polls where needed.

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/messages` | required | — lists my conversations |
| POST | `/messages` | required | `{ username }` — gets or creates a 1:1 conversation with that user |
| GET | `/messages/:conversationId/messages?page&limit` | required (participant only) | — also marks fetched messages as read |
| POST | `/messages/:conversationId/messages` | required (participant only) | `{ body }` |

## Subscription Plans (Pricing)

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/plans` | none | — active plans only, sorted by `order` |
| GET | `/plans/:slug` | none | — |
| POST | `/plans` | required, `manage_subscription_plans` permission (Owner only) | `{ name, slug, monthly, yearly, description?, features?, cta?, highlight?, badge?, order? }` |
| PATCH | `/plans/:id` | required, Owner only | any subset of the same fields |
| DELETE | `/plans/:id` | required, Owner only | — soft-delete (`isActive: false`) |

Seeded with Free / Premium / Creator Pro, matching the current Pricing page. Run `npm run seed` in `server/` to create them if missing.

## Discovery / Feed

Powers the Home page - all public, no auth required.

| Method | Path | Body/Query | Notes |
|---|---|---|---|
| GET | `/feed?type&category&page&limit` | `type` = `all`\|`video`\|`short`\|`image`\|`article` | combined approved Video/Image/Article, newest first |
| GET | `/feed/trending?limit` | — | same merge, ranked by an engagement-vs-age score (views + likes×3 + comments×5, decayed by age) over the last 30 days |
| GET | `/feed/creators?limit` | — | top users by follower count, staff roles excluded |
| GET | `/feed/stats` | — | real platform counters: `{ totalUsers, activeCreators, contentPublished, totalViews }` — deliberately has no "monthly views" or "countries reached" figure since neither is derivable from current data |

## Creator Dashboard

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/dashboard/stats` | required, `access_creator_dashboard` permission | — real totals: `{ stats: { totalViews, followers, totalLikes, contentCount }, content: [...] }` |
| GET | `/dashboard/content` | required, `access_creator_dashboard` permission | — all of the caller's own Video/Image/Article docs, newest first |

## Admin (Owner-managed)

Role hierarchy: **Owner** — one fixed account, the platform's single top authority. It is not a role that gets assigned or reassigned to anyone; it already holds every permission a "Super Admin" would and more, so there is no separate Super-Admin-assignment feature anywhere in the app. Below Owner: **Admin** (5 concurrent slots max platform-wide, filled/freed only by Owner, job is content moderation) → **Moderator** → **Creator** → **Premium** → **Standard**. Revoking an Admin restores whatever role they held before promotion (or `creator` if that's unknown) — nothing about the moderation queue is tied to a specific person, so reassigning a slot never loses state.

(Note: the `super_admin` value still technically exists in the `Role` enum/schema for forward-compatibility, but no route or UI can ever assign it — it's permanently unreachable through the app.)

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/admin/stats` | Moderator+ | — `{ totalUsers, adminSlotsUsed, adminSlotsTotal, totalCreators, pendingContentCount }` |
| GET | `/admin/users?role&search&page&limit` | Admin+ | — user directory |
| POST | `/admin/users/:username/creator` | Admin+ | — grants Creator status (only from Standard/Premium) |
| DELETE | `/admin/users/:username/creator` | Admin+ | — revokes Creator status back to Standard |
| POST | `/admin/users/:username/admin` | Owner only | — fills one of the 5 Admin slots; 409 if all 5 are taken |
| DELETE | `/admin/users/:username/admin` | Owner only | — frees the slot, restores their previous role |
| GET | `/admin/content/pending?type&page&limit` | Moderator+ | — combined pending Video/Image/Article queue, oldest first |
| POST | `/admin/content/:type/:id/approve` | Moderator+ | `:type` = `video`\|`image`\|`article` |
| POST | `/admin/content/:type/:id/reject` | Moderator+ | `{ reason? }` — stored on the content doc as `moderationNote` |

## Site Config / Branding

| Method | Path | Auth | Body |
|---|---|---|---|
| GET | `/config/branding` | none | — powers the dynamic theme CSS variables |
| PATCH | `/config/branding` | required, `manage_branding` permission (Owner only) | partial `SiteConfig` fields |
| POST | `/config/branding/logo` | required, Owner only | form-data: `logo` (file) |
| POST | `/config/branding/favicon` | required, Owner only | form-data: `favicon` (file) |

## SEO

Served at the app root (not under `/api/v1`) since crawlers expect these at the real site root.

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/sitemap.xml` | none | dynamic - static routes + every approved Video/Image/Article + every creator's channel URL |
| GET | `/robots.txt` | none | allows everything except `/dashboard`, `/admin`, `/superadmin`, `/messages`, `/notifications`, `/upload`, `/owner/branding`; points `Sitemap:` at `${CLIENT_URL}/sitemap.xml` |

**Deployment note:** both live on the API server for DB access, but need to be reachable at the frontend's actual domain root (e.g. `https://yoursite.com/sitemap.xml`) for search engines to find them - once frontend/backend are deployed, add a reverse-proxy rewrite (Vercel rewrite, Nginx `location` block, etc.) from the frontend domain's `/sitemap.xml` and `/robots.txt` to these two routes.

On the frontend, every page sets its own `<title>`/meta description/Open Graph/Twitter-card tags via `client/src/hooks/useSeo.ts` (no react-helmet dependency - a small DOM-upsert utility in `client/src/utils/seo.ts`), with the Owner's branding-level defaults (editable at `/owner/branding`) as the site-wide fallback. **Caveat:** this is a client-rendered SPA, so these tags are only visible to crawlers that execute JavaScript (Googlebot does). Link-preview bots that fetch raw HTML without running JS (some chat apps, some social platforms) won't see them - a full fix needs server-side rendering or a bot-specific prerender, which is a larger follow-up once deployment topology is decided.

## Health

| Method | Path | Auth |
|---|---|---|
| GET | `/health` | none — reports API + MongoDB connection status |

---

## Known limitations (deliberate, not oversights)

- **Messages are REST-only.** No Socket.io/WebSocket push yet — a sent message only appears to the other participant when they load or re-poll the conversation. Real-time delivery is a natural next step once this REST layer is confirmed working.
- **No day-by-day analytics.** Video/Image/Article only store a running `views` counter, not timestamped view events, so `/dashboard/stats` returns real totals but can't produce a genuine "views this week" trend. That would need a separate `ViewEvent` log — noted as follow-up work rather than faked with placeholder numbers.
- **No password-change UI yet.** The owner account password can currently only be changed by editing the database directly or re-registering; a `/dashboard/settings` password form is a good next addition.
- **No reports pipeline.** Content moderation (approve/reject queue) is built and working, but there's no separate "user reports a post" flow yet — that's a distinct Phase 4 item (a `Report` model + endpoints) that hasn't been started.
- **No true time-series analytics.** Video/Image/Article only store a running `views` counter, not timestamped view events, and follower counts aren't snapshotted over time either. The Dashboard and `/feed/stats` show real current totals and real breakdowns (content mix, top content, moderation status, recent followers) instead of a day-by-day trend line — a genuine trend chart would need a `ViewEvent`/`FollowerSnapshot` log, noted as follow-up work rather than faked.
- **No real payment processor.** Pricing plans are real (`/plans`), but there's no Stripe/PayPal integration yet, so plan CTA buttons route to sign-up rather than an actual checkout — see Phase 3 in `REQUIREMENTS-STATUS.md`.
