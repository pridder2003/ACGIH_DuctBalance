#!/usr/bin/env bash
set -euo pipefail

PORT=8080
python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/duct_smoke.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" >/dev/null 2>&1 || true' EXIT

sleep 1

curl -sfI "http://127.0.0.1:${PORT}/index.html" >/dev/null
curl -sfI "http://127.0.0.1:${PORT}/app.js" >/dev/null
curl -sfI "http://127.0.0.1:${PORT}/calc.js" >/dev/null
curl -sfI "http://127.0.0.1:${PORT}/styles.css" >/dev/null

echo "Smoke load checks passed on http://127.0.0.1:${PORT}"
