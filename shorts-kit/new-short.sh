#!/usr/bin/env bash
# Start a new Short in 1 command:  ./new-short.sh ~/projects/my-new-short
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; DEST="${1:?usage: new-short.sh <dest-dir>}"
mkdir -p "$DEST"; cp -R "$HERE/template/." "$DEST/"; rm -rf "$DEST/pages-example"; cp "$HERE/MASTER_SPEC.md" "$DEST/MASTER_SPEC.md"
cp -R "$HERE/pages-example" "$DEST/" 2>/dev/null || cp -R "$HERE/template/pages-example" "$DEST/pages-example"
(cd "$DEST" && git init -q 2>/dev/null || true; cd remotion && npm install --no-audit --no-fund >/dev/null)
echo "Ready: $DEST"; echo "Next: scripts/transcribe.sh <audio> '<vocab>' -> edit storyboard.json + remotion/src/scenes.tsx -> prep -> mix -> npm run render"
