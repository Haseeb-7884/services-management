Design a modern, premium, mobile-first UI for [PLATFORM NAME] - a Creator Hub
platform where creators run channels and publish articles, images, short
videos, and stories; followers browse, like, comment, and follow content.
Long-term vision includes paid memberships and monetization, but design only
the core browsing/creating experience described below - no payment flows,
checkout, or backend logic in this pass.

===========================================
GLOBAL DESIGN SYSTEM (apply identically across all 5 screens)
===========================================

COLOR PALETTE
- Background base: deep navy, near-black (#0A1628 to #050D1A range), applied
  as a subtle vertical gradient (darker at top and bottom, slightly lighter
  in the middle) rather than a flat fill.
- Accent/brand color: one vibrant electric cyan/blue (#00D4FF range), used
  for primary buttons, active nav states, links, icons-on-hover, focus
  rings, badges, and the glow effect described below. Use it sparingly and
  consistently - it should read as "the one accent," not scattered everywhere.
- Secondary accent: a slightly deeper cyan/teal (#00A8CC range) for
  secondary buttons, gradients, and hover states derived from the primary.
- Surface/card color: a lighter navy than the base background (visibly
  distinct, not just 5% different) so cards clearly separate from the page
  behind them - this contrast matters, don't let cards blend into the page.
- Text: near-white (#FFFFFF) for headings and primary text, muted blue-gray
  (#8B98A8 range) for secondary/meta text (timestamps, view counts, captions).
- Borders: subtle low-opacity light borders on cards (barely visible, just
  enough to define edges), with a brighter accent-colored border on
  hover/active/selected states.

TYPOGRAPHY
- Clean modern sans-serif (Poppins, Inter, or similar geometric sans).
- Clear hierarchy: large bold headings (28-36px), medium subheadings
  (18-20px, semi-bold), body text (14-16px, regular), small meta/label text
  (12-13px, muted color, medium weight, slightly letter-spaced for labels).
- Generous line-height on body copy for readability against the dark
  background.

SPACING & LAYOUT
- Generous whitespace/padding throughout - avoid cramped layouts.
- Consistent corner radius across cards, buttons, and inputs (rounded,
  ~12-16px on cards, ~8-10px on buttons/inputs, fully rounded on avatars/pills).
- 12-column responsive grid on desktop, single-column stacked on mobile.
- Consistent card padding (~20-24px) and gap between grid items (~16-24px).

INTERACTIVE ELEMENT STYLING (describe visually, do not wire up interactivity)
- Primary button: solid accent-color fill, dark text or white text depending
  on contrast, soft cyan glow/shadow around it, slightly brighter on hover.
- Secondary/outline button: transparent fill, accent-colored border and
  text.
- Ghost/icon buttons: no border, muted icon color, accent color on hover.
- Cards: subtle glow or lift (shadow) on hover to suggest interactivity even
  though this is a static screen.
- Badges/pills (e.g. "LIVE," "Verified," plan tier names): small, rounded-
  full, colored background at low opacity with full-opacity text/icon in
  that same color.
- Input fields: dark surface fill, subtle border, accent-colored border on
  focus state (show at least one input in its focused state somewhere so
  the style is visible).

ICONOGRAPHY
- Simple, consistent-weight line icons (not mixed styles) for nav, actions
  (like/comment/share/play), and stat indicators.

===========================================
SCREENS TO GENERATE (5 total, one cohesive design system reused across all)
===========================================

--- SCREEN 1: HOME FEED ---
- Top navigation bar: logo/site name on the left, search bar in the center
  (desktop) or a search icon (mobile), nav icons for Explore/Notifications/
  Messages, and a user avatar circle on the right that opens into a small
  profile menu affordance.
- Hero section directly below nav: a large featured-content banner (image or
  video thumbnail) with a title, short description, a category badge, and a
  primary "Watch Now" or "Read" button overlaid with a dark gradient scrim
  for text legibility.
- "Trending" horizontal rail: a row of 5-6 compact content cards (thumbnail,
  title, creator name + small avatar, view count, content-type icon) that
  visually implies horizontal scroll on mobile.
- "Featured Creators" horizontal rail: 5-6 circular creator avatars with
  name and follower count beneath each, follow button on hover.
- Main feed grid below: a masonry or grid layout mixing content types -
  some cards are article-style (cover image + headline + excerpt), some are
  video-style (thumbnail + duration badge + play icon overlay), some are
  image-post style (square thumbnail). Each card shows creator avatar +
  name, timestamp, and like/comment counts at the bottom.
- Bottom tab bar on mobile only (Home, Explore, Create [+], Notifications,
  Profile) - not shown on desktop, where the top nav covers navigation.

--- SCREEN 2: CHANNEL PAGE ---
- Full-width banner/cover image at the top (with the dark gradient scrim
  toward the bottom for text legibility).
- Overlapping circular avatar (breaks out of the banner slightly) with a
  small "Verified" checkmark badge attached to its bottom-right corner.
- Channel name (large, bold), a one-line handle/category under it, and a
  "Verified Creator" badge/pill next to the name if applicable.
- Follower count and total content count as small stat text.
- Follow button (primary, accent-filled) and a secondary "Share" icon
  button, right-aligned next to the channel name on desktop, stacked below
  on mobile.
- Bio paragraph (2-3 lines) beneath the header block.
- Row of small social platform icons linking out (YouTube, Instagram,
  TikTok, X, WhatsApp) - muted icon color, accent color on hover.
- Horizontal tab bar beneath the bio: Posts / Articles / Videos / Shorts /
  About - active tab underlined or filled in accent color.
- Below the tabs: a content grid matching the active tab's type (reuse the
  same card styles from the Home Feed screen for consistency).

--- SCREEN 3: CONTENT DETAIL VIEW ---
- Show this as a video content example.
- Large video player area at the top (thumbnail with a centered play button
  icon and duration badge, since this is static - not an actual playing
  video).
- Below the player: content title (large, bold), then a row with creator
  avatar + name + verified badge + follow button, view count, and upload
  date.
- Action row: like button (with count), comment button (with count), share
  button, save/bookmark icon - each as icon + label, using the ghost/icon
  button style from the design system.
- Short description/caption text block beneath the action row.
- Comments section: a "X Comments" heading, a comment input field (showing
  its focused state per the design system), then 3-4 example comments each
  with a small avatar, commenter name, timestamp, comment text, and a
  small like-count + reply affordance.
- Sidebar (desktop only, hidden/stacked below on mobile): "Up Next" list of
  4-5 small horizontal content cards (thumbnail + title + creator + views).

--- SCREEN 4: CREATOR DASHBOARD ---
- Left sidebar navigation (desktop): Dashboard, My Content, Analytics,
  Audience, Settings - with the current section highlighted in accent color.
  On mobile, collapse this into a top dropdown or hamburger menu instead.
- Page header: "Welcome back, [Creator Name]" plus a primary "Upload New"
  button, right-aligned.
- Row of 4 stat cards: Total Views, Followers, Total Likes, Storage Used
  (this one shown as a small progress bar with "X GB of Y GB used" text) -
  each card shows a large number, a small label, an icon, and a small
  colored trend indicator (up/down arrow + percentage) for the first three.
- One simple analytics chart below the stat cards: a line or bar chart
  showing views/engagement over the last 7-30 days, with axis labels and a
  legend, styled in the accent color against the dark card background.
- Content management table/list below the chart: a list of the creator's
  uploads, each row showing a small thumbnail, title, content-type icon,
  status badge (Published/Draft/Processing), view count, upload date, and
  edit/delete icon actions on the right.

--- SCREEN 5: PRICING PAGE ---
- Centered page header: "Choose Your Plan" title with a short supporting
  subheading beneath it.
- Optional monthly/yearly toggle switch above the cards (styled per the
  design system's input/toggle look), with a small "Save X%" badge next to
  the yearly option.
- 3 pricing cards side by side on desktop, stacked on mobile: Free, Premium,
  Creator Pro.
  - Each card: plan name, large price, billing period text, a short one-
    line description, a divider, then a checklist of 5-6 features (checkmark
    icon + text per line, using muted text for features NOT included in
    that tier, shown with an x-icon or strikethrough instead).
  - The middle tier (Premium) is visually elevated: slightly larger/taller
    card, a "Most Popular" badge/ribbon at the top, an accent-colored border
    or glow around the whole card that the other two don't have.
  - Each card ends with a full-width button - accent-filled primary style
    for the recommended tier, outline/secondary style for the other two.
- Small FAQ or reassurance row beneath the cards (e.g. "Cancel anytime," a
  small trust/security icon row) to round out the page.

===========================================
OUTPUT INSTRUCTIONS
===========================================
Generate these 5 screens as static, high-fidelity design mockups only - no
prototype interactivity (no clickable links between screens) and no backend
or data logic. Reuse the exact same color values, type scale, spacing, and
component styles (buttons, cards, badges, inputs) across every screen so it
reads as one consistent design system, not 5 separate designs.