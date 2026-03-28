#!/usr/bin/env bash
set -euo pipefail
 
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_ROOT/.env"

load_env() {
  local env_file="$1"
  while IFS= read -r line || [[ -n "$line" ]]; do
    line=${line%$'\r'}
    [[ -z "$line" ]] && continue
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ "$line" != *=* ]] && continue

    local key=${line%%=*}
    local value=${line#*=}
    key=${key//[$'\t\r\n ']}
    [[ -z "$key" ]] && continue
    export "$key=$value"
  done < "$env_file"
}

require_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    echo "ERROR: $command_name is not installed. Rebuild the web image after updating the Dockerfile." >&2
    exit 1
  fi
}

if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: Missing .env at $ENV_FILE" >&2
  exit 1
fi

load_env "$ENV_FILE"

: "${POSTGRES_DB:?POSTGRES_DB must be set in .env}"
: "${POSTGRES_USER:?POSTGRES_USER must be set in .env}"
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD must be set in .env}"

require_command psql

SCHEMA_FILE="$SCRIPT_DIR/01-${POSTGRES_DB}_schema.sql"
DATA_FILE="$SCRIPT_DIR/02-${POSTGRES_DB}_data.sql"

if [[ ! -f "$SCHEMA_FILE" || ! -f "$DATA_FILE" ]]; then
  echo "ERROR: Expected dump files not found in $SCRIPT_DIR" >&2
  exit 1
fi

echo "Restoring schema from $(basename "$SCHEMA_FILE")..."
PGPASSWORD="$POSTGRES_PASSWORD" \
  psql -v ON_ERROR_STOP=1 \
  -h "${POSTGRES_HOST:-db}" \
  -p "${POSTGRES_PORT:-5432}" \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  < "$SCHEMA_FILE"

echo "Restoring data from $(basename "$DATA_FILE")..."
PGPASSWORD="$POSTGRES_PASSWORD" \
  psql -v ON_ERROR_STOP=1 \
  -h "${POSTGRES_HOST:-db}" \
  -p "${POSTGRES_PORT:-5432}" \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  < "$DATA_FILE"

echo "Restore complete."
