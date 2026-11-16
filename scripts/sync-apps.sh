#!/bin/bash
# Rebuild the small static apps from their sibling repos and copy them into public/.
# Each app's vite.config.ts sets base to the path it is served from.
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
sync() { # repo-dir build-dir public-name
  (cd "$here/../$1" && npm run build)
  rm -rf "$here/public/$3"
  cp -R "$here/../$1/$2" "$here/public/$3"
  echo "synced $3"
}
sync cook-split dist cooksplit
sync prediction-scorecard/site dist calledit
