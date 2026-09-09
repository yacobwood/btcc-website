# BTCC Hub Website

A public website for the British Touring Car Championship - news, results, standings, the full
2004-2026 season archive, driver/team profiles and circuit guides. Built by the same team as the
[BTCC Hub app](https://play.google.com/store/apps/details?id=com.btccfanhub) and sharing its exact
design language and data.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind v4. Deployed on Vercel
(`btcchub.vercel.app`).

## Data

No separate backend. Every page fetches the same JSON the app itself consumes at runtime, straight
from `raw.githubusercontent.com/yacobwood/BTCC/main/data/*.json`, via Next's `fetch(...,
{next: {revalidate}})` (ISR) - see `lib/data.ts`. Revalidate windows are set per file to match how
often that data actually changes (standings/results/news: minutes during a race weekend; calendar/
drivers/circuits: hours to a day).

Two intentional deviations from the raw source data, both documented in code:
- `lib/data.ts`'s `getTracks()` corrects a known bug in the upstream `tracks.json` (Silverstone's
  length was the full Grand Prix Arena circuit, not the National layout BTCC actually races).
- `components/DriverAvatar.tsx` falls back to a number badge for the handful of drivers with no
  photo yet in the source data (a new signing, a reserve who hasn't raced).

## Pages

`/`, `/news` (+ `/news/[slug]`), `/results` (+ `/results/[year]` + `/results/[year]/[round]`),
`/calendar`, `/circuits` (+ `/circuits/[slug]`), `/drivers` (+ `/drivers/[slug]`), `/teams`
(+ `/teams/[slug]`).

News deliberately shows only this operation's own original editorial (`hub_news.json`'s "Flying
Lap" digests) - not a mirror of btcc.net's own articles.

There is no "open in app" gate - every route renders real content. Live timing, chat and push
notifications are app-only; those are cross-promoted inline (`components/AppPromoCard.tsx`,
`Footer.tsx`) rather than blocking any page. Only a real, working Google Play link is shown - there
is currently no live iOS distribution (BTCC declined the permission needed for it), so no App
Store badge is shown anywhere.

**Not yet built** (see project plan for scope): `/gallery` (225 albums / ~26k photos), `/academy`
(regs-explainer articles), `/records` (all-time stats), `/partners`, `/watch` (broadcast info).

## Do not remove

`public/.well-known/assetlinks.json` and `public/app-ads.txt` are load-bearing for systems outside
this repo - Android App Links verification for the BTCC Hub app, and AdMob/ad verification -
unrelated to whatever this site's own content is. Keep them in place regardless of future content
redesigns.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run lint   # required before shipping - no test framework in this repo
```
