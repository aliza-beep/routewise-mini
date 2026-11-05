# RouteWise

RouteWise is a responsive travel-intelligence and complete trip-planning web app. It helps travelers turn a destination idea into a practical itinerary, compare flight research honestly, understand connection risk, estimate costs, and keep saved plans in the browser.

**Tagline:** Beyond the Ticket

## What works

- Cinematic, responsive home page with a route-aware search panel, featured destinations, planning benefits, Journal edit, intelligence highlights and complete workflow explanation.
- Trip planner for 22 countries with arrival/departure-aware day plans, date-based night calculations, travel styles, traveler counts, and editable cost estimates.
- Professional flight research studio with searchable curated airports, date/traveler/style controls, airline/hub research prompts, parameterized Google Flights links and saved link research. The retired custom-offer editor is hidden while legacy records remain readable.
- Searchable, region-filterable destination directory with editorial photography, gateways, highlights, typical pacing/season, and three clearly labeled planning-cost levels.
- Travel Intelligence and Booking Guide sections with official-source links and careful risk/visa language.
- Consumer-focused Travel Journal with a maximum six-story edit, dedicated `/journal/:slug` articles, source-grounded live briefs, evergreen RouteWise Guides, photography, filters and graceful cached fallback.
- Browser-local saved trips, deletion, print view, and CSV itinerary export.
- About, privacy, terms, intellectual-property and travel/fare disclaimer pages plus a substantial ownership footer.
- Route-level code splitting and a separately loaded Recharts cost chart.

## Stack and setup

React, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, and React Router.

```bash
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`). Vite tests the client only; it does **not** run `/api/news`.

To test the complete Pages application, including Functions:

```bash
npm run dev:pages
```

Open `http://localhost:8788` and verify `http://localhost:8788/api/news`. The first response may take several seconds while upstream feeds respond; later responses use Cloudflare's cache behavior. Run `npm run build`, `npm test`, and `npm run check:functions` for production, utility, and Function compilation checks.

## Architecture

- `src/data.ts`: curated destination/airport/airline research references and the news client adapter.
- `src/types.ts`: domain models for destinations, trips, flights, costs, and news.
- `src/utils.ts`: pure itinerary, cost, duration, layover, scoring, formatting, and persistence utilities.
- `src/home-page.tsx`: cinematic homepage and functional trip search.
- `src/pages.tsx`: planner, destinations, intelligence, booking guide and saved trips.
- `src/flight-page.tsx`: flight search, Google Flights research persistence and read-only legacy-offer compatibility.
- `src/news.tsx`: editorial selection, homepage Journal cards, dedicated articles, caching, filtering, retry and evergreen guide fallback.
- `src/legal-page.tsx`: ownership, privacy, terms, IP and travel/fare notices.
- `src/cost-chart.tsx`: lazily loaded Recharts visualization.
- `functions/api/news.js`: Cloudflare Pages Function for feed retrieval, safe parsing, categorization, deduplication, and caching.
- `src/components.tsx`: shared navigation, footer, page headers, notices, fields, and empty states.
- `src/styles.css`: Tailwind layers and the RouteWise design system.

Calculations are kept outside page markup so they can be tested or replaced independently. Existing saved trips and legacy offers retain `routewise-trips` and `routewise-offers`; Google Flights research uses `routewise-google-flight-research`, and the latest successful feed response uses `routewise-news-cache` for graceful fallback.

## Data and honesty constraints

- Destination content and daily costs are curated planning references, not freshly verified travel advice or bookable prices.
- Flight prices are never generated. The comparison desk only evaluates offers the user enters and records the source and verification date.
- The duration calculator requires ISO 8601 timestamps with explicit offsets, such as `2026-12-01T18:00-05:00`, so cross-zone elapsed times are calculated correctly.
- Visa/entry requirements are not inferred. The app routes users to official immigration, embassy, IATA, or government advisory sources.
- News summaries are created by stripping markup and length-limiting source-supplied descriptions. They are not AI-generated and do not add facts.
- Risk information is a decision framework, not a live route assessment.
- Unsplash image URLs and Google Fonts are fetched at runtime; core planning functionality still works if those assets are unavailable.

## News sources and behavior

The Function uses these tested public feeds advertised by their publishers:

- UK FCDO foreign travel advice Atom feed: `https://www.gov.uk/foreign-travel-advice.atom`
- Australian Government Smartraveller all-destinations RSS: `https://www.smartraveller.gov.au/countries/documents/index.rss`
- Lufthansa Group Newsroom RSS: `https://newsroom.lufthansagroup.com/feed/en`
- Emirates Media Centre RSS: `https://www.emirates.com/media-centre/feed/en-us`

Feeds are fetched concurrently with an eight-second timeout, parsed to a conservative common model, stripped of unsafe HTML, deduplicated by canonical link, and sorted only by valid source timestamps. A missing timestamp is displayed as unavailable—not as today. Response metadata includes `fetchedAt`, `status`, and per-feed errors. CDN/edge caching is requested for 30 minutes with stale-while-revalidate fallback. “Retry feeds” bypasses the cached response for a new fetch.

Automatic categorization uses transparent keywords plus a source-appropriate default. Relevance scoring rejects vacancies, appointments, financial notices, workshops and routine technical approvals; it rewards passenger, destination, route, entry and disruption relevance, recency and usable excerpts. Near-repetitive subjects are reduced before the client applies source diversity. The Journal shows at most three live feed briefs and fills the remaining six-story ceiling only with clearly labeled evergreen RouteWise Guides. It never fabricates an item for an empty category.

Live article pages are deliberately short source-grounded briefs: they use only feed titles and excerpts, state that limitation, and link to the original publisher. They do not claim full-source reporting. Stable IDs are derived from canonical source URLs; the cached feed payload helps recently shared article links survive temporary upstream failures.

## Photography and licensing

Destination and editorial photography is served from Unsplash image URLs with destination-specific alt text, an Unsplash license link, lazy loading below the fold and a navy fallback when the remote image fails. Images accompanying live updates are explicitly described as reference destination imagery—not documentary images of an event. Before third-party redistribution or offline packaging, manually confirm each image’s current Unsplash source metadata and attribution requirements.

## Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Node.js: current LTS

No authentication, paid services, or client-side API secrets are required.

### Deploying Functions with an existing Direct Upload project

Dashboard drag-and-drop uploads do not compile a `functions/` directory. Deploy from the repository root with Wrangler so both `dist/` and `functions/` are included:

```bash
npm install
npm run build
npx wrangler login
npx wrangler pages deploy dist --project-name YOUR_EXISTING_PAGES_PROJECT
```

This uses Cloudflare's free Pages/Workers workflow and does not require a paid API. Confirm the existing project name with `npx wrangler pages project list`. Run the command from this project root; otherwise Wrangler will not discover the sibling `functions/` directory. An alternative is a Git-integrated Pages project with build command `npm run build` and output `dist`, but an existing Direct Upload project cannot be converted to Git integration in place.

## Current limitations

- No live fare, schedule, seat availability, disruption, weather or visa API is connected. Feed articles are news/advisory references, not live route assessments.
- The manual custom-offer editor has been retired from the visible experience. Existing `routewise-offers` records remain visible read-only with elapsed-time and connection-risk calculations.
- Data is local to one browser/device and is not synchronized.
- Currency totals are not converted across currencies.
- Live-feed articles can disappear when publishers remove them and the local cached payload is unavailable; the article route then shows an honest unavailable state.
