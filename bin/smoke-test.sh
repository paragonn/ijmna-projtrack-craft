#!/usr/bin/env bash
#
# smoke-test.sh — quick post-deploy sanity check for the IJM Progress Tracker.
#
# Hits the key public and CP routes and confirms they respond correctly,
# with no PHP/Yii error pages, in under a few seconds. It's not a full test
# suite — just a fast "did the deploy actually work" check.
#
# Usage:
#   bin/smoke-test.sh                                   # checks https://ijmna-projtrack-craft.ddev.site
#   bin/smoke-test.sh https://ijmnaprojecttracker.org    # checks a given base URL
#   BASE_URL=https://staging.example.com bin/smoke-test.sh
#   bin/smoke-test.sh -k https://ijmna-projtrack-craft.ddev.site   # -k = skip TLS verification (self-signed/local)
#
# Exit code: 0 if every check passes, 1 if any check fails.

set -u

INSECURE=""
if [[ "${1:-}" == "-k" ]]; then
  INSECURE="-k"
  shift
fi

BASE_URL="${1:-${BASE_URL:-https://ijmna-projtrack-craft.ddev.site}}"
BASE_URL="${BASE_URL%/}"
CP_TRIGGER="${CP_TRIGGER:-control}"
TIMEOUT="${SMOKE_TIMEOUT:-10}"

# Auto-detect local ddev sites and skip TLS verification for them, since
# they use a self-signed/mkcert cert curl may not trust from every shell.
if [[ -z "$INSECURE" && "$BASE_URL" == *".ddev.site"* ]]; then
  INSECURE="-k"
fi

RED=$'\033[0;31m'
GREEN=$'\033[0;32m'
YELLOW=$'\033[0;33m'
NC=$'\033[0m'

PASS=0
FAIL=0

# Signatures that indicate a broken page even when curl gets a 200
ERROR_SIGNATURES=(
  "Exception in "
  "yii\\\\base\\\\ErrorException"
  "Whoops, looks like something went wrong"
  "Fatal error"
  "There was a problem"
  "Internal Server Error"
)

# check NAME METHOD PATH EXPECTED_STATUS [BODY_MUST_CONTAIN] [JSON_BODY]
check() {
  local name="$1" method="$2" path="$3" expected="$4" must_contain="${5:-}" json_body="${6:-}"
  local url="${BASE_URL}${path}"
  local tmpfile
  tmpfile="$(mktemp)"

  local status curl_args=(-sS $INSECURE -o "$tmpfile" -w '%{http_code}' --max-time "$TIMEOUT" -X "$method")
  if [[ -n "$json_body" ]]; then
    curl_args+=(-H "Content-Type: application/json" -d "$json_body")
  fi
  status="$(curl "${curl_args[@]}" "$url" 2>/dev/null)"
  local curl_exit=$?

  if [[ $curl_exit -ne 0 ]]; then
    echo "${RED}✗ FAIL${NC}  ${name} — could not connect to ${url} (curl exit ${curl_exit})"
    FAIL=$((FAIL + 1))
    rm -f "$tmpfile"
    return
  fi

  if [[ "$status" != "$expected" ]]; then
    echo "${RED}✗ FAIL${NC}  ${name} — expected HTTP ${expected}, got ${status} (${url})"
    FAIL=$((FAIL + 1))
    rm -f "$tmpfile"
    return
  fi

  for sig in "${ERROR_SIGNATURES[@]}"; do
    if grep -qi "$sig" "$tmpfile"; then
      echo "${RED}✗ FAIL${NC}  ${name} — HTTP ${status} but page body contains error text: \"${sig}\" (${url})"
      FAIL=$((FAIL + 1))
      rm -f "$tmpfile"
      return
    fi
  done

  if [[ -n "$must_contain" ]] && ! grep -qi "$must_contain" "$tmpfile"; then
    echo "${RED}✗ FAIL${NC}  ${name} — HTTP ${status} but expected text \"${must_contain}\" not found (${url})"
    FAIL=$((FAIL + 1))
    rm -f "$tmpfile"
    return
  fi

  echo "${GREEN}✓ PASS${NC}  ${name} (HTTP ${status})"
  PASS=$((PASS + 1))
  rm -f "$tmpfile"
}

echo "Running smoke tests against: ${BASE_URL}"
[[ -n "$INSECURE" ]] && echo "${YELLOW}(TLS verification disabled)${NC}"
echo ""

# --- Public site ---------------------------------------------------------
check "Homepage loads"            GET "/"                              200 "IJM"
check "App CSS asset loads"       GET "/assets/css/app.css"            200
check "App JS asset loads"        GET "/assets/js/app.js"              200

# The GraphQL schema on this project requires an Authorization token, so an
# unauthenticated query correctly 400s. We're checking that it fails *cleanly*
# with that specific message (proves the endpoint/schema is alive), not that
# it 500s or hangs. Adjust this if the public schema is ever opened up.
check "GraphQL API endpoint up"   POST "/api" 400 "Missing Authorization header" '{"query":"{__typename}"}'

# --- Control panel ---------------------------------------------------------
check "CP login page loads"       GET "/${CP_TRIGGER}/login"           200

# --- Common 404 sanity check (confirms routing works both ways) ---------
check "Unknown route 404s"        GET "/this-page-should-not-exist-xyz" 404

echo ""
echo "-----------------------------------------"
if [[ $FAIL -eq 0 ]]; then
  echo "${GREEN}${PASS} passed, 0 failed.${NC}"
  exit 0
else
  echo "${RED}${FAIL} failed${NC}, ${PASS} passed."
  exit 1
fi
