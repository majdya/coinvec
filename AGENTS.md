# AI Crypto Advisor Dashboard — Build Plan

## Rules

1. **5-file edit limit** — In each coding section, edit a maximum of 5 files. If more files are needed, ask the user to proceed to the next section.
2. **No extra comments** — Do not add explanatory comments to code. Let the code speak for itself.
3. **Follow existing conventions** — Match the style, libraries, and patterns already used in the codebase.
4. **Read before edit** — Always read a file before modifying it.
5. **No emoji** — Never use emojis in code or commit messages unless asked.
6. **Verify after changes** — After completing a section, run lint/typecheck if available, then report what was done.
7. **One task at a time** — Focus on the current phase. Do not skip ahead or add scope not requested.
8. **No documentation files** — Do not create README or `.md` files unless explicitly asked.
9. **No secrets in code** — Use environment variables for all API keys, secrets, and config.
10. **Commit only when asked** — Never commit changes unless the user explicitly says to.

## Tech Stack
- **Frontend:** Next.js + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** SQLite via Prisma
- **Auth:** JWT (jsonwebtoken + bcrypt)
- **APIs:** CoinGecko (prices), CryptoPanic (news), random meme API
- **AI:** Free-tier LLM API (Gemini / OpenAI) for daily crypto tip

## Architecture

```
coinvec/
├── client/          # Next.js frontend
├── server/          # Express backend
└── shared/          # Shared types (optional)
```

## Phases

### Phase 1: Project Setup
- Initialize `server/` with Express, CORS, dotenv, Prisma (SQLite), jsonwebtoken, bcrypt
- Initialize `client/` with Next.js, Tailwind, axios
- Prisma schema: `User` model (id, email, name, password, createdAt)

### Phase 2: Auth
- Backend: POST `/api/auth/register`, POST `/api/auth/login`, auth middleware
- Frontend: Login page, Signup page, protected routes, auth context

### Phase 3: Daily Dashboard
- **Coin Prices** — CoinGecko `/simple/price` or `/coins/markets`
- **Market News** — CryptoPanic API (free tier)
- **Meme** — `https://meme-api.com/gimme` or similar
- **AI Crypto Advisor** — Free LLM generates daily tip from prices + news
- Loading states, error handling, responsive layout

### Phase 4: Polish
- Auto-refresh (e.g. 60s interval)
- Loading skeletons, error boundaries
- Responsive design

## Folder Structure

```
server/
├── prisma/schema.prisma
├── src/
│   ├── routes/auth.js
│   ├── routes/dashboard.js
│   ├── middleware/auth.js
│   ├── services/coingecko.js
│   ├── services/cryptopanic.js
│   ├── services/meme.js
│   └── index.js
client/
├── pages/
│   ├── index.js
│   ├── login.js
│   ├── signup.js
│   └── dashboard.js
├── components/
│   ├── Layout.js
│   ├── CoinPrices.js
│   ├── MarketNews.js
│   ├── Meme.js
│   └── AITip.js
└── styles/
```
