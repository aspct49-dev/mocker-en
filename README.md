# Mocker-EN — community leaderboards

Wager leaderboards for the Mocker-EN community. The Rain.gg board (`/`) and the
CaseBattle board (`/casebattle`) are on this site. The Gamdom board is run on
[Mocker Rewards](https://mockerrewards.com): its tab links to `/gamdom`, which
307-redirects there.

Next.js 15 (App Router) · React 19 · TypeScript. No CSS framework — two
hand-written stylesheets under `src/app`.

## Running it

```bash
npm install
cp .env.example .env.local   # then fill in the two keys
npm run dev                  # http://localhost:3000
```

| Variable | What it is |
|---|---|
| `RAIN_API_KEY` | Rain.gg affiliate key, sent as `x-api-key`. Server-only. |
| `CASEBATTLE_LEADERBOARD_PASSWORD` | CaseBattle deal's public leaderboard password. Server-only. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin. Optional on Vercel. |

## Deploying to Vercel

1. In Vercel, **Add New → Project** and import `aspct49-dev/mocker-en`. The
   framework is detected as Next.js; the build command and output directory
   need no changes.
2. Under **Settings → Environment Variables**, add these for Production,
   Preview and Development:

   | Variable | Value |
   |---|---|
   | `RAIN_API_KEY` | The Rain.gg affiliate API key. |
   | `CASEBATTLE_LEADERBOARD_PASSWORD` | The CaseBattle deal's public leaderboard password. |
   | `NEXT_PUBLIC_SITE_URL` | Your final origin, e.g. `https://mocker-en.com`. Optional. |

   The build succeeds without either key, but that board then shows every
   seat as open with a "temporarily unavailable" notice.
3. Deploy, attach your domain under **Settings → Domains**, and set
   `NEXT_PUBLIC_SITE_URL` to match. Until it is set, canonical URLs, the
   sitemap and `robots.txt` use Vercel's production hostname.

`.env.local` is gitignored and must never be committed; Vercel reads the key
from its own store.

After the first deploy, open `/robots.txt` and `/sitemap.xml` and check they
point at your domain, and open `/gamdom` to check it lands on Mocker Rewards.

## Data

`src/lib/providers/rain.ts` reads **`/v1/affiliates/races`** and picks the
active race on code `Mocker`. The race is configured on Rain itself, so its
standings, payout split (`payout_distribution`, in hundredths of a coin), start
and end all come from Rain. The board here and the race on rain.gg cannot
disagree, and changing the prizes is done on Rain, not in this repo.

Rain rate-limits the endpoint and asks for at least ten minutes of caching:
both the fetch and the page revalidate every 600 seconds. Do not lower it.

If the call fails, or there is no active race, the board renders every paying
seat as open with `fallbackPrizes` from `src/lib/casinos.ts` and a "temporarily
unavailable" notice. It never shows sample rows. Keep `fallbackPrizes` in step
with the race on Rain.

Usernames are masked (`D*****K`) in `providers/shared.ts`, so a new provider
cannot forget to.

## CaseBattle

`src/lib/providers/casebattle.ts` reads the public leaderboard of our deal,
`/deals/{deal}/leaderboard?password=…&from=…&to=…&limit=50`. The password is
the deal's "public leaderboard password" from the CaseBattle deal dashboard;
it is a secret and lives only in `CASEBATTLE_LEADERBOARD_PASSWORD`.

Unlike Rain, the race is ours, not CaseBattle's: CaseBattle only reports what
each referred player wagered between `from` and `to`. The window and the
prize split are `CASEBATTLE_PERIOD` and `CASEBATTLE_PRIZES` in
`src/lib/casinos.ts` — currently $1,500 over ten places
(600/350/200/120/80/50/40/30/20/10), 23 Oct 2026 00:00 CEST to 22 Nov 2026
23:59:59 CET. For the next race, change those two constants and the
`clockNote` that states the dates in words. Prizes and wagers are dollars, so
figures carry a `$` instead of a coin.

The endpoint is undocumented. The reader expects CaseBattle's own leaderboard
row, `{ user: { username, avatar }, wagered }`, but also takes flat names and
`amount`/`points` in case the shape differs; when the first players appear,
check the board against the deal dashboard. The fetch and page revalidate
every 300 seconds. No request is made before the race opens.

## Socials

Kick and X are `SOCIALS` in `src/lib/site.ts`; the top bar (icons) and the
footer (with handles) both read it, and a bonus card with `contact: true`
gets a "Contact us" link to X.

## Gamdom

`board` on each entry in `src/lib/casinos.ts` says where that casino's board
lives: `here`, `external` (with a URL), or `soon`. Gamdom is `external`, so
`src/app/gamdom/route.ts` redirects `/gamdom` to that URL with a 307 — kept
temporary so browsers do not cache it, since the board may move here later.
Change the destination in `casinos.ts`, not in the route.

To host the Gamdom board on this site instead:

1. Write `src/lib/providers/gamdom.ts` implementing `LeaderboardProvider`.
2. Register it in `PROVIDERS` in `src/lib/services/leaderboard.ts`.
3. Set Gamdom's `board` to `{ at: 'here' }` and fill in its `unit`.
4. Replace `src/app/gamdom/route.ts` with a `page.tsx` — the Rain page is the
   template.

## Bonuses

`/bonuses` is its own page (`src/app/bonuses/page.tsx`), linked from the nav.
Only Gamdom has an offer there; Rain's was removed and CaseBattle has none.
The offers are `BONUSES` in `src/lib/casinos.ts`: the headline figure and the
words after it, the list of what is included, an optional note, and each
casino's accent colour (taken from its logo). The cards
(`components/Bonuses.tsx`, styled in `bonuses.css`) read everything from
there, so changing an offer or adding a casino is an edit to that array and no
CSS. Each card's button uses that casino's `signupUrl`, and the note under it
names the casino's `code`.

## Design

From the two pieces of brand art:

- **The wordmark** — black ground, a green ribbon (`#004010` → `#10F090`),
  silver-white letters. Green is the only interface accent; the page title
  carries the same white-to-silver split as the lettering.
- **Rain's side art** — the same greens in the smoke, gold `#F7B016` in the
  sparks and the coin. Gold is spent on coins, prizes and first place only.

The podium is gold / silver / bronze: the one place a convention carries
meaning the brand green cannot. Card structure follows the reference board —
coloured border, portrait over the top edge with a hex place badge, `WAGERED`
label, prize plate across the bottom edge.

Type is Russo One (display, closest to the wordmark's block letters) and Chakra
Petch (body and every figure, tabular numerals), per the ui-ux-pro-max
gaming/esports pairing. Its suggested purple palette was not used — the brand
art decides colour.

The podium is flanked by a display of Rain coins and Rain stars
(`components/PodiumFlank.tsx`) — on the CaseBattle board, dollar coins in
CaseBattle's orange and its helmet mark — tucked partly behind the outer cards, with
depth from size, blur and opacity. All of it is drawn in SVG and CSS, so it is
sharp at any width, and it is static. It shrinks at tablet widths and is
hidden once the cards stack on a phone.

**No glows.** Buttons are flat fills, titles carry only the wordmark's dark
keyline, and depth comes from neutral shadows, not coloured halos. The one
lit dot is the live-feed indicator. Keep it that way: a coloured glow under
every button is the fastest way to make this look like a template.

Motion lives in `motion.css`, imported last: a staggered load sequence on
each page, scroll reveals for anything marked `data-reveal`
(`components/Reveal.tsx`, which never hides what is already on screen), a
rolling countdown, a cross-fade between pages via the browser's view
transitions, and a press-and-lift on buttons and cards. One exponential
ease-out throughout; only opacity and transforms move. All of it is off under
`prefers-reduced-motion`. All text tokens clear WCAG AA on every ground they
sit on (lowest: `--dim` on `--hull-2`, 5.48:1).

## Layout

```
brand/               source art, not served
public/              served assets, trimmed and converted from brand/
src/
  app/
    layout.tsx       fonts, metadata, nav and footer
    page.tsx         the Rain.gg leaderboard
    casebattle/      the CaseBattle leaderboard
    bonuses/         the bonuses page
    gamdom/          redirect to Mocker Rewards
    globals.css      tokens, buttons, nav, footer
    leaderboard.css  hero, switcher, podium, countdown, standings, steps, rules
    bonuses.css      the offer cards on /bonuses
    motion.css       load sequences, scroll reveals, transitions
    icon.svg         favicon: a blocky M in the brand green
    apple-icon.png   180px home-screen icon, same M, full-bleed
    robots.ts        robots.txt, generated
    sitemap.ts       sitemap.xml, generated
  components/        LeaderboardView (one board page, any casino), Podium,
                     Board, CasinoSwitch, Countdown, PodiumFlank, …
  lib/
    casinos.ts       codes, links, prizes, steps, rules
    providers/       the only code that talks to a casino
    services/        the only entry point pages use for a board
```
