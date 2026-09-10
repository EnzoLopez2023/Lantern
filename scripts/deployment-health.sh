#!/usr/bin/env bash

verify_release() {
  local phase="$1" max_attempts="$2" expected_sha="$3" expected_build_id="$4" excluded_instance="${5:-}"
  local confirm=0 confirmed_instance='' attempt nonce live ready ver instance ok
  for attempt in $(seq 1 "$max_attempts"); do
    nonce="$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT-$phase-$attempt"
    ok=1
    live="$(curl -sS --max-time "$HTTP_TIMEOUT_SECONDS" -H 'Cache-Control: no-cache' \
      -w $'\n%{http_code}' "$PRODUCTION_URL$LIVE_PATH?probe=$nonce")" || ok=0
    ready="$(curl -sS --max-time "$HTTP_TIMEOUT_SECONDS" -H 'Cache-Control: no-cache' \
      -w $'\n%{http_code}' "$PRODUCTION_URL$READY_PATH?probe=$nonce")" || ok=0
    ver="$(curl -sS --max-time "$HTTP_TIMEOUT_SECONDS" -H 'Cache-Control: no-cache' \
      -w $'\n%{http_code}' "$PRODUCTION_URL$VERSION_PATH?probe=$nonce")" || ok=0

    # /api/live exposes only its process ID; /api/ready nests release identity in build.
    if [[ "$ok" == 1 && "${live##*$'\n'}" == 200 && "${ready##*$'\n'}" == 200 && "${ver##*$'\n'}" == 200 ]] \
      && instance="$(printf '%s\n' "${live%$'\n'*}" "${ready%$'\n'*}" "${ver%$'\n'*}" \
        | jq -ers --arg sha "$expected_sha" --arg buildId "$expected_build_id" \
          --arg excludedInstance "$excluded_instance" '
            select(length == 3)
            | .[0] as $live | .[1] as $ready | .[2] as $version
            | select(
                $live.status == "live" and $ready.status == "ready"
                and ($version.instanceId | type == "string" and length > 0)
                and $live.instanceId == $version.instanceId
                and $ready.build.instanceId == $version.instanceId
                and $ready.build.commit == $sha and $ready.build.buildId == $buildId
                and $version.commit == $sha and $version.buildId == $buildId
                and ($excludedInstance == "" or $version.instanceId != $excludedInstance)
              )
            | $version.instanceId
          ' 2>/dev/null)"; then
      if [[ "$instance" != "$confirmed_instance" ]]; then
        confirm=0
        confirmed_instance="$instance"
      fi
      confirm=$((confirm + 1))
      echo "$phase exact confirmation $confirm/$REQUIRED_CONFIRMATIONS (attempt $attempt, instance=$instance)"
      if [[ "$confirm" -ge "$REQUIRED_CONFIRMATIONS" ]]; then
        return 0
      fi
    else
      echo "$phase not confirmed (attempt $attempt): unhealthy response or inconsistent release/process identity"
      confirm=0
      confirmed_instance=''
    fi
    sleep "$POLL_INTERVAL_SECONDS"
  done
  echo "::error::Exact $phase release did not reach $REQUIRED_CONFIRMATIONS consecutive confirmations from one process"
  return 1
}
