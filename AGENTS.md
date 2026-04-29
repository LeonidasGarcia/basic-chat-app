# AGENTS.md

## Repo Shape
- No root Node workspace. Work per package: `client/` and `server/`.
- `client/` is the Vite app. Entrypoints: `client/src/main.tsx` -> `client/src/App.tsx`.
- `server/` is the NestJS + Socket.IO backend. Entrypoint: `server/src/main.ts`, wired in `server/src/app.module.ts`.

## Dev Commands
- Full local bootstrap from repo root: `./init-dev.sh`
- `./init-dev.sh` is the source of truth for setup: it runs `npm ci` in both packages, creates `server/.env` from `.env.example` if missing, starts Postgres via `server/docker-compose.yml`, runs Prisma generate + migrate, then starts server and client.
- Client:
  - `npm run dev --prefix client`
  - `npm run build --prefix client`
  - `npm run lint --prefix client`
- Server:
  - `npm run start:dev --prefix server`
  - `npm run build --prefix server`
  - `npm run start --prefix server`
  - `npm run prisma:generate --prefix server`
  - `npm run prisma:migrate --prefix server`

## Verification
- There is no test suite or CI config in this repo.
- Best verification after frontend changes: `npm run lint --prefix client` and `npm run build --prefix client`.
- Best verification after server changes: `npm run build --prefix server`.
- If you change `server/prisma/schema.prisma`, run `npm run prisma:generate --prefix server`; if the schema changed, also run `npm run prisma:migrate --prefix server`.

## Runtime Facts
- Server health check: `GET http://localhost:3001/health`
- Default dev ports:
  - server: `3001`
  - client: `5173`
- Server CORS defaults to `http://localhost:5173` from `server/.env.example`.
- Socket.IO namespace is `/chat`.
- Every socket joins the internal room `general` automatically.
- Clients must send `auth:identify` before `message:send` or `typing`, or the server emits `error` with code `UNIDENTIFIED`.

## Tooling Quirks
- Client build is also its typecheck: `npm run build --prefix client` runs `tsc -b && vite build`.
- React Compiler is enabled in `client/vite.config.ts`; preserve that setup when touching Vite/Babel config.
- Tailwind is v4 via `@tailwindcss/vite`; `client/src/index.css` only imports Tailwind.

## Source Of Truth
- For websocket behavior, trust `server/src/chat/chat.gateway.ts` over prose docs if they drift.
- Event docs are in `server/docs/WEBSOCKET_EVENTS.md` and `server/docs/asyncapi.yaml`.

## Git Gotcha
- `.gitignore` currently ignores `server/prisma/migrations/` and `server/.env.example`.
- If you create a Prisma migration, do not assume `git status` will show it; check explicitly or force-add if the user wants it committed.
