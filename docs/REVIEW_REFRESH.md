# Scribist Review + Refresh (April 2026)

## What was reviewed
- Build health (`npm run build`)
- Dependency security posture (`npm audit`)
- Auth flow (email/password)
- API/runtime wiring and deployment safety

## Key findings
1. **No Google sign-in** despite being a planned enhancement.
2. JWT payload included full user doc shape instead of minimal safe fields.
3. Production server start logic prevented `server.listen` when `NODE_ENV=production`.
4. CORS was hardcoded with a trailing slash origin and no environment configuration.
5. Build passes, but legacy CRA stack shows warnings and known dependency debt.

## Refresh changes implemented
- Added Google sign-in (frontend + backend token verification).
- Added `/api/users/google` endpoint with Google ID token verification.
- Added user model fields for Google auth (`googleId`, `authProvider`) with local-login compatibility.
- Tightened JWT payload to safe user fields only.
- Updated server runtime:
  - starts in all envs except `test`
  - uses env-configurable CORS allowlist
- Added `.env.example` for consistent setup.

## Validation
- `npm run build` passes.

## Remaining backlog (recommended)
- Resolve high/critical dependency vulnerabilities from `npm audit`.
- Address React hook dependency warnings in:
  - `src/components/Timer/Timer.js`
  - `src/pages/Berserk/Berserk.js`
  - `src/pages/Doc/Doc.js`
  - `src/pages/TypeTest/TypeTest.js`
- Plan migration away from deprecated CRA stack.
