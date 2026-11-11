#!/usr/bin/env bash
# Usage: scripts/transcribe.sh "/path/recording.WAV" "vocab hint, Kilo Code, LSP"
# Writes assets/audio/whisper_medium.json (word timestamps) and prints segments so you can pick the LAST take.
set -euo pipefail
SRC="$1"; HINT="${2:-}"; OUT="$(cd "$(dirname "$0")/.." && pwd)/assets/audio"; mkdir -p "$OUT"
ffmpeg -y -loglevel error -i "$SRC" -ac 1 -ar 16000 "$OUT/a16.wav"
whisper "$OUT/a16.wav" --model medium --language en --word_timestamps True --initial_prompt "$HINT" --output_format json --output_dir "$OUT/w" >/dev/null
mv "$OUT/w/a16.json" "$OUT/whisper_medium.json"; rm -rf "$OUT/w" "$OUT/a16.wav"
python3 -I - "$OUT/whisper_medium.json" <<'P'
import json,sys
for s in json.load(open(sys.argv[1]))["segments"]: print(f"{s['start']:7.1f}-{s['end']:7.1f}  {s['text']}")
P
echo "-> pick the last take's start/end and put them in storyboard.json take.start / take.end"
