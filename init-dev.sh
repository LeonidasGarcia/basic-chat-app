#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

say() {
  printf "%s\n" "$*"
}

warn() {
  printf "Warning: %s\n" "$*"
}

run_compose() {
  local compose_file="$1"

  if docker compose -f "$compose_file" up -d; then
    return 0
  fi

  if command -v sudo >/dev/null 2>&1; then
    say "Retrying Docker Compose with sudo..."
    if sudo docker compose -f "$compose_file" up -d; then
      return 0
    fi
  fi

  return 1
}

wait_for_http() {
  local url="$1"
  local name="$2"
  local attempts="${3:-30}"
  local delay_seconds="${4:-1}"

  for ((i = 1; i <= attempts; i++)); do
    if curl --silent --fail "$url" >/dev/null 2>&1; then
      say "$name is ready: $url"
      return 0
    fi
    sleep "$delay_seconds"
  done

  say "$name did not become ready in time: $url"
  return 1
}

wait_for_postgres_container() {
  local attempts="${1:-30}"
  local delay_seconds="${2:-1}"
  local compose_file="$ROOT_DIR/server/docker-compose.yml"
  local use_sudo=false

  if ! docker compose -f "$compose_file" ps postgres >/dev/null 2>&1; then
    use_sudo=true
  fi

  for ((i = 1; i <= attempts; i++)); do
    if [[ "$use_sudo" == true ]]; then
      if sudo docker compose -f "$compose_file" exec -T postgres pg_isready -U chat -d chat >/dev/null 2>&1; then
        say "Postgres is ready."
        return 0
      fi
    else
      if docker compose -f "$compose_file" exec -T postgres pg_isready -U chat -d chat >/dev/null 2>&1; then
        say "Postgres is ready."
        return 0
      fi
    fi
    sleep "$delay_seconds"
  done

  say "Postgres did not become ready in time."
  return 1
}

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    say "Missing required command: $1"
    exit 1
  fi
}

need_cmd node
need_cmd npm
need_cmd curl

say "== Installing dependencies =="
npm ci --prefix "$ROOT_DIR/client"
npm ci --prefix "$ROOT_DIR/server"

say "== Preparing server env =="
if [[ ! -f "$ROOT_DIR/server/.env" ]]; then
  cp "$ROOT_DIR/server/.env.example" "$ROOT_DIR/server/.env"
  say "Created server/.env from .env.example (edit if needed)."
fi

say "== Starting Postgres (docker compose) =="
if ! command -v docker >/dev/null 2>&1; then
  say "Docker is required but was not found in PATH."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1 && ! sudo docker compose version >/dev/null 2>&1; then
  say "Docker Compose is required but unavailable."
  exit 1
fi

if ! run_compose "$ROOT_DIR/server/docker-compose.yml"; then
  say "Could not start Postgres with Docker Compose."
  say "Make sure the Docker daemon is running and your user can access Docker, or provide sudo access."
  exit 1
fi

if ! wait_for_postgres_container; then
  exit 1
fi

say "== Running Prisma generate + migrations =="
if ! npm run prisma:generate --prefix "$ROOT_DIR/server"; then
  warn "Prisma client generation failed."
  exit 1
fi

if ! npm run prisma:migrate --prefix "$ROOT_DIR/server" -- --name init; then
  warn "Prisma migration failed."
  warn "Make sure Postgres is running and matches DATABASE_URL in server/.env."
  exit 1
fi

say "== Starting dev servers =="
say "- Server: http://localhost:3001 (Socket.IO namespace /chat)"
say "- Client: http://localhost:5173"
say "Press Ctrl+C to stop both."

cleanup() {
  say "\nStopping dev servers..."
  [[ -n "${SERVER_PID:-}" ]] && kill "$SERVER_PID" 2>/dev/null || true
  [[ -n "${CLIENT_PID:-}" ]] && kill "$CLIENT_PID" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

npm run start:dev --prefix "$ROOT_DIR/server" &
SERVER_PID=$!

npm run dev --prefix "$ROOT_DIR/client" &
CLIENT_PID=$!

say "== Waiting for services =="
if ! wait_for_http "http://localhost:3001/health" "Server"; then
  exit 1
fi

if ! wait_for_http "http://localhost:5173" "Client"; then
  exit 1
fi

say "== All services are healthy =="

wait "$SERVER_PID" "$CLIENT_PID"
