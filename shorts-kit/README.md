# 🎬 Shorts Starter Kit

One folder to start a new YouTube Short fast (built from the "$200 LSP" Short).

| Path | What |
|---|---|
| `MASTER_SPEC.md` | The recipe: pre-prod → prod → post-prod, rules, timings, checklists, lessons |
| `new-short.sh` | `./new-short.sh ~/projects/my-short` — copies the template and runs `npm install` |
| `template/` | Working code: `scripts/` (transcribe, prep, mix), `remotion/` (Short, scenes, kit, Hook, Thumb, config), `storyboard.json`, `nav.js` + `style.css` (shared menu) |
| `template/pages-example/` | `index.html` (Pre-prod / Prod / Post-prod sections) and `metadata.html` to copy from |
| `skills/new-short/SKILL.md` | Claude Code skill: `cp -R skills/new-short ~/.claude/skills/` then say "make a short" |
| `syntax/cheatsheet.md` | Remotion, ffmpeg, Whisper and git one-liners |

## Quick start
```bash
./new-short.sh ~/projects/my-short && cd ~/projects/my-short
scripts/transcribe.sh "/path/recording.WAV" "names, jargon"     # pick the LAST take
# edit storyboard.json (take, scenes) and remotion/src/scenes.tsx
python3 -I scripts/prep_remotion.py && python3 -I scripts/mix_audio.py
cd remotion && npm run render && npm run thumb
```
