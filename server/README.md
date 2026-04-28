# Server (Nest.js + Socket.IO)

## Requirements
- Node.js
- Postgres (or `docker compose`)

## Setup (local)
1. Copy env file: `cp .env.example .env`
2. Start Postgres (optional): `docker compose up -d`
3. Run migrations: `npm run prisma:migrate`
4. Start dev server: `npm run start:dev`

Socket.IO namespace: `/chat`

Docs:
- `docs/WEBSOCKET_EVENTS.md`
- `docs/asyncapi.yaml`
