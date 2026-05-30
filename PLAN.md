# AI Crypto Advisor Dashboard — Requirements

## Project Overview

A crypto investor dashboard with JWT auth, live coin prices, market news, a fun meme, and an AI-generated daily crypto tip.

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + Tailwind v4 + axios
- **Backend:** Express 5 + Prisma (SQLite)
- **Auth:** JWT (jsonwebtoken + bcrypt)
- **APIs:** CoinGecko (prices), CryptoPanic (news), meme-api.com (meme), Gemini 2.0 Flash (AI tip)

---

## Current State (Already Done)

### Backend — Complete

- Express server with CORS, JSON parsing, health check
- Prisma schema with `User` model (id, email, name, password, createdAt)
- SQLite database created (`prisma/dev.db`)
- Auth middleware (`src/middleware/auth.js`) — Bearer token verification
- Auth routes (`src/routes/auth.js`):
  - `POST /api/auth/register` — validates inputs, checks uniqueness, hashes password, returns JWT
  - `POST /api/auth/login` — finds user, compares password, returns JWT

### Frontend — Scaffold

- Next.js 16 initialized with App Router
- Tailwind v4 configured
- Root layout with Geist font
- Default landing page (placeholder)

---

## Requirements by Phase

### Phase 1: Frontend Auth (4 files)

Create login/signup pages, auth context, and API client.

| #   | File                            | What It Does                                                                                                   |
| --- | ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | `client/app/login/page.js`      | Email/password form, calls login API, redirects to /dashboard                                                  |
| 2   | `client/app/signup/page.js`     | Email/name/password form, calls register API, redirects to /dashboard                                          |
| 3   | `client/context/AuthContext.js` | React context holding user/token/loading state; provides login/register/logout; persists token in localStorage |
| 4   | `client/lib/api.js`             | Axios instance with base URL, Bearer token interceptor, 401 redirect                                           |

### Phase 2: Dashboard API (4 files)

Backend services for external APIs and dashboard endpoint.

| #   | File                                 | What It Does                                                                                                                                                                            |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5   | `server/src/services/coingecko.js`   | GET `/simple/price` for BTC/ETH/SOL with USD price + 24h change                                                                                                                         |
| 6   | `server/src/services/cryptopanic.js` | GET top 5 news posts, fallback data on failure                                                                                                                                          |
| 7   | `server/src/services/meme.js`        | GET random meme image from meme-api.com, fallback on failure                                                                                                                            |
| 8   | `server/src/routes/dashboard.js`     | `GET /api/dashboard` — calls all 3 services in parallel via `Promise.allSettled`, returns partial data on failure; `GET /api/dashboard/tip` — calls Gemini API with prices+news context |

### Phase 3: Frontend Dashboard (5 files)

Dashboard page and 4 data components.

| #   | File                              | What It Does                                                                             |
| --- | --------------------------------- | ---------------------------------------------------------------------------------------- |
| 9   | `client/app/dashboard/page.js`    | Protected page, fetches dashboard data on mount, 2-col grid layout, passes data as props |
| 10  | `client/components/CoinPrices.js` | 3 cards: BTC/ETH/SOL with price + 24h change (green/red), skeleton loading               |
| 11  | `client/components/MarketNews.js` | 5 news items with title, source, relative time, external links                           |
| 12  | `client/components/Meme.js`       | Renders meme image with title, rounded + constrained                                     |
| 13  | `client/components/AITip.js`      | Styled card with AI tip text, "Get AI Tip" / "Regenerate" button                         |

### Phase 4: Polish (1-2 files)

| #   | File                                    | What It Does                                                   |
| --- | --------------------------------------- | -------------------------------------------------------------- |
| 14  | `client/components/ErrorBoundary.js`    | Wraps dashboard sections so one failure doesn't crash the page |
| —   | `client/app/dashboard/page.js` (update) | Add 60s auto-refresh interval, cleanup on unmount              |
| —   | Components (update)                     | Add `animate-pulse` skeleton states to all data components     |

## API Endpoints

| Method | Endpoint             | Auth | Description                 |
| ------ | -------------------- | ---- | --------------------------- |
| GET    | `/api/health`        | No   | Health check                |
| POST   | `/api/auth/register` | No   | Create account, returns JWT |
| POST   | `/api/auth/login`    | No   | Login, returns JWT          |
| GET    | `/api/dashboard`     | Yes  | Prices + news + meme        |
| GET    | `/api/dashboard/tip` | Yes  | AI-generated daily tip      |

## Env Variables

### `server/.env`

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="<random-string>"
PORT=5000
```

### `client/.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Implementation Order

1. Frontend Auth (4 files) — login, signup, context, api client
2. Dashboard API (4 files) — 3 services + dashboard route
3. Frontend Dashboard (5 files) — page + 4 components
4. Polish (auto-refresh, skeletons, error boundary)

## Key Design Decisions

- **Auth:** JWT stored in localStorage, sent as Bearer header via axios interceptor
- **Protected routes:** AuthContext checks token on mount; dashboard redirects to /login if no token
- **Error resilience:** Backend `Promise.allSettled` returns partial data; frontend error boundaries isolate failures
- **State management:** React Context only (no Redux needed for this scope)
- **AI:** Gemini 2.0 Flash (free tier, 60 req/min) — prompt includes current prices + news for daily advice
