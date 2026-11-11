---
name: new-short
description: Build a YouTube Short (9:16, Remotion) from a voice recording or script. Use when the user says "make a short", "build my short", "turn this audio into a short", "preprod prod postprod", or gives a recording plus a script idea. Follows shorts-kit/MASTER_SPEC.md.
---

# new-short

Follow `shorts-kit/MASTER_SPEC.md` (find it next to this skill: `../../MASTER_SPEC.md`). Order of work:

1. **Bootstrap**: `shorts-kit/new-short.sh <dest>` (copies template, installs Remotion). Work on a branch, never main.
2. **Pre-prod**: read the user's recording folder. Transcribe with `scripts/transcribe.sh`. When the audio has repeated takes, **the LAST take is the correct one** — set `take.start/end` in `storyboard.json`. Show the script.
3. **Prod**: one scene per spoken beat in `storyboard.json` (`start_word` = first word of the beat, `word#2` = 2nd occurrence). Write/modify scene components in `remotion/src/scenes.tsx` using `kit.tsx` primitives. `python3 -I scripts/prep_remotion.py && python3 -I scripts/mix_audio.py`. Check stills (`npx remotion still src/index.ts Short out/f.png --frame=N`), tile them, **look at them**, fix overlaps with the subtitle zone (y 1500–1700).
4. **Post-prod**: `npm run render`, `npm run thumb`, check loudness (−14 LUFS, TP ≤ −3), copy MP4 + thumbnail to `~/Downloads`.
5. **Pages**: one `index.html` with Pre-prod / Prod / Post-prod sections and the shared menu (`nav.js`), plus a separate `metadata.html`. Update `MASTER_SPEC.md` with any new lesson.
6. `python3 -I scripts/build_site.py` (player + rendered Markdown pages), commit on a branch, push, deploy (GitHub Pages from the branch, spec section 14), verify the live file, show clickable URLs.

Gotchas: if Remotion fails with `spawn Unknown system error -88`, `remotion.config.ts` must point at the installed Google Chrome. ffmpeg here has no libass/drawtext: all text via Remotion. Never write API keys to files. Don't put the user's name/email in outside requests.

Install: `cp -R shorts-kit/skills/new-short ~/.claude/skills/new-short`
