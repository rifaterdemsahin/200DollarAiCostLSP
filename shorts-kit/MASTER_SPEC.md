# 🎬 Master Spec v2: YouTube Shorts (Remotion)

Reusable recipe. Proven on "Don't Pay $200. Give Your Cheap Model Glasses." (48.9 s, $0 API cost). Copy this kit, fill section 0, follow the three phases.
> 🔒 Never write API keys to files, commits or chats. Env var per command only.

## 0. Brief (fill in)
| Field | Value |
|---|---|
| Working title / claim we answer / our reply | |
| Metaphor (one image per beat) | |
| Hook (≤ 12 words, typed card, frame 0) | |
| Payoff / formula | |
| CTA (one ask; name + URL placeholder) | |
| Inputs | voice recording (WAV), optional on-camera clip, planning script |
| Format | 9:16, 1080×1920, 30 fps, ≤ 60 s (target 35–50 s) |
| Budget | $0 by default (local audio synthesis); optional fal.ai for images/voice |

## 1. Phases and deliverables
One `index.html` with **three sections + a shared menu and a floating notes panel (copy/download) on every page** (`nav.js`), plus one separate `metadata.html`.
| Phase | Section id | Contents |
|---|---|---|
| 1 Pre-prod | `#preprod` | brief, source files, transcript, **final script**, original planning script, captions plan, proof check, action cues |
| 2 Prod | `#prod` | pipeline diagram, scene-timing table, code links, build commands |
| 3 Post-prod | `#postprod` | delivery links, measured length/loudness/cost, sanity checklist |
| — | `metadata.html` | title (+alternates), description, tags, pinned comment, upload settings, thumbnail, copy buttons and counters |

## 2. Inputs → script
1. `scripts/transcribe.sh <wav> "<vocab>"` (Whisper **medium** + `--initial_prompt` with jargon; the small model mishears terms, e.g. LSP→"LSB").
2. **Repeated takes: the LAST take is the correct one.** Set `take.start/end` in `storyboard.json` (pad ~0.3 s before the first word, ~0.5 s after the last).
3. Fix ASR errors only in `prep_remotion.py` (word patches); keep timing from Whisper. Inserting a word (e.g. "not") = split the neighbour's time span.
4. A video file with no audio track is silent b-roll: don't lip-sync it to a separate recording; use motion graphics unless you can sync it (clap or waveform).

## 3. Script structure
Hook (typed card, 1.5 s, no voice) → beats (one scene per spoken sentence/idea) → close. Open loop closed by the payoff; one CTA; opinions framed as opinions.

## 4. storyboard.json
```json
{ "take": {"source":"ZOOM.WAV","start":68.2,"end":114.4}, "hook_seconds":1.5, "outro_seconds":1.2,
  "scenes":[ {"id":1,"type":"price","start_word":"$200","action":"…"}, {"id":8,"type":"smart","start_word":"Distilled#2"} ] }
```
`start_word` = first spoken word of the beat (`word#n` = nth occurrence after the previous scene). Scene length = until the next scene's first word. **Never hand-time scenes.** `type` maps to a component in `scenes.tsx` via `MAP` in `Short.tsx`.

## 5. Visuals (fun + action)
- Each scene: a bold full-screen gag built from emoji + SVG + `kit.tsx` primitives (`Pop`, `Shake`, `Big`, `SpeedLines`, `Confetti`, `Emoji`, `ease`, `useSpring`).
- Punch-zoom 5 frames at every cut (done in `Short.tsx`), white flash on snaps, shake on impacts, confetti on wins.
- Colour-code the story: red = problem, green = fix, blue/orange = neutral beats; one idea per scene.
- Subtitles: 3 words, 84 px, yellow current word, black stroke, `bottom: 330`. **Scene content must stay above y≈1500** (`Fill` has `paddingBottom: 380`; absolute items must be placed manually). Platform UI covers the bottom ~250 px and right edge.
- Progress bar 16 px at the bottom. No act labels.
- Always render ~10 stills, tile them with ffmpeg and **look at them** before the full render.
- ffmpeg has no libass/drawtext on this Mac: all text is Remotion.

## 6. Audio (free, local)
1. Cut + clean take: `highpass 80, afftdn, loudnorm I=-14`.
2. `mix_audio.py`: synthesized 120 bpm beat (kick/snare/hat/bass), SFX from scene types (whoosh on cuts, slam on impacts, snap+ding on fixes, jingle on close), sidechain duck, fade in 1 s / out 2 s, final loudnorm.
3. Target −14 LUFS, true peak ≤ −3 dBFS (`ebur128=peak=true`).
4. Voice delayed by `hook_seconds`. Add scene-type → SFX rules in `mix_audio.py` when you add scenes.

## 7. Thumbnail
`Thumb` still, 1080×1920: claim line, answer biggest (yellow), one emoji hero, tag line ~420 px above bottom. Check readable at 160 px wide.

## 8. Build
```bash
./new-short.sh ~/projects/<slug>
scripts/transcribe.sh <wav> "<vocab>"
python3 -I scripts/prep_remotion.py && python3 -I scripts/mix_audio.py
cd remotion && npm run render && npm run thumb          # out/short.mp4, out/thumbnail.png
cp out/short.mp4 ../short.mp4; cp out/thumbnail.png ../thumbnail.png
cp out/short.mp4 ~/Downloads/<slug>.mp4                 # browser download buttons on file:// are unreliable
```
Render ≈ 80 s for 49 s on Apple silicon.

## 9. Metadata spec
Title ≤ 100 chars (+2 alternates, `#Shorts`); description = hook, reframe, formula, CTA, honesty line, 3–5 hashtags; tags ≤ 500 chars; Not made for kids; **Altered/synthetic = Yes only for realistic AI people/voices**; pinned comment with a question.

## 10. Sanity check (before publishing)
- [ ] Hook typed on frame 0; voice starts ≤ 2 s  - [ ] last take used; transcript matches subtitles  - [ ] length < 60 s
- [ ] −14 LUFS, TP ≤ −3  - [ ] no overlap with subtitle zone in stills  - [ ] proof asset exists for any tech claim
- [ ] unproven claims listed as opinion  - [ ] guessed words (names, jargon) checked by ear  - [ ] no secrets (`grep -rI "sk_\|key"`)  - [ ] watched once with sound

## 11. Delivery
`short.mp4`, `thumbnail.png` at repo root and in `~/Downloads`; `index.html`, `metadata.html`, `MASTER_SPEC.md` updated; branch + push + deploy (GitHub Pages); show clickable URLs; open in Google Chrome (`open -a "Google Chrome" <url>`).

## 12. Lessons (don't repeat)
| Problem | Fix |
|---|---|
| `spawn Unknown system error -88` on render | Use installed Chrome via `remotion.config.ts` (`setBrowserExecutable`) |
| Whisper small: "LSB", wrong jargon | `medium` + `--initial_prompt` vocabulary |
| Same word appears twice in the take | `start_word: "word#2"` |
| Subtitles collided with scene text | `Fill` paddingBottom 380; keep absolutes above y 1500 |
| Two takes in one recording | Last take wins; record the discarded range in `storyboard.json` note |
| Silent 4K video + separate WAV | Don't fake lip-sync; motion graphics now, synced picture-in-picture in v2 |
| Emoji glasses misplaced in thumbnail | Check the still at full size; nudge `top/left` |
| `sed -i` on macOS | `sed -i ''` or edit with a script |
| Earlier fal-based flow cost money | Local synth audio + emoji/SVG visuals = $0; use fal only for realistic imagery (see old spec in `MASTER_SPEC_fal_v1.md` if present) |


## 13. On-camera video + images (added after the $200 LSP Short)
1. **Video has its own audio? Use it only to sync.** `scripts/sync_video.py cam.MP4 voice.WAV` cross-correlates the camera audio with the recording (100 Hz envelope, then confidence = peak / 50th peak, want > 3), prints `voice_time = camera_time + X`, and cuts the take's clip to `remotion/public/cam.mp4` (cropped 9:16, **no audio**). The mix uses only the clean recording. Check `ffprobe` for an audio stream before claiming a clip is silent.
2. Verify sync numerically: correlate the camera audio with `voice_clean.wav` in 5 windows; lag must be identical (< 33 ms = 1 frame). Mouth-motion correlation is too noisy (hands/beard); don't rely on it.
3. **Cut in and out** with `cams` in `storyboard.json` (`{id, from, to}` seconds on the final timeline). `CamLayer` plays `cam.mp4` at `startFrom = from - hook_seconds` so lips stay on the voice; overlay components per `id` (`CAM` map in `Short.tsx`) add banners/emoji/props. Entry = 7-frame scale-in + white flash. A-roll is zoomed `ZOOM = 1.22` about the face (`transformOrigin: 50% 42%`) + slow push-in; **re-aim any prop that sits on the face (sunglasses) after changing the zoom**. Crop the 4K frame around the face (`video.crop`; test one frame first).
4. Timed inserts use `overlays` (`{id, from, to}`): `logos` (hook), `ronaldinho` (user photos), `bank`. Align them to spoken words (`word timestamps`), not to guessed times; the user's timecodes are targets, snap to the nearest matching words.
5. User-provided images: copy to `remotion/public/img/`, show in tilted bordered cards. Frontier-lab logos: `cdn.jsdelivr.net/npm/simple-icons@13.15.0/icons/<name>.svg` (anthropic, openai, googlegemini, meta, mistralai, deepseek; no xai: draw text). Put logos on white tiles. Brand/car/product images you don't have: draw SVG stand-ins and flag them in the sanity check.
6. Banners: `white-space: nowrap`, 80–104 px; check long text isn't clipped. Keep cam overlays out of the face (hair line y≈300 is free for chips).
7. Loudness: AAC re-encode drops ~1.5 LU; mix at −14 targets final ≈ −15.5 LUFS, still within tolerance; set `loudnorm=I=-12.5` if you need exact −14.
8. **Cuts**: `take.cuts: [[start,end]]` (recording seconds) remove words from the voice; `prep_remotion.py` rebuilds `voice_clean.wav` from the kept pieces (12 ms fades), drops/shifts the word timings and writes `data.cuts` so `clipTime()` skips the same ranges in `cam.mp4`. Windows must not straddle a cut. After a cut, every later timecode moves earlier by the removed length (re-derive `cams`/`overlays` from word times; `word#n` counts change).
9. **Props that sit on the face** (sunglasses): don't place by hand. `scripts/track_eyes.swift` (macOS Vision, `swiftc -O`) writes `assets/eyes.json` (10 fps eye centres); `EyeGlasses` sits **inside** `CamLayer`'s zoomed layer via `inner`, so it follows head, tilt and zoom. Extract frames with `ffmpeg -vf fps=10,scale=540:960`.
10. **User photos of cars/people/places**: blur number plates and other identifiers (`boxblur` on cropped regions; radii must stay < half the crop's chroma size) and say so in the sanity check.
11. "Relaxed / reaction" beats: use the A-roll itself (it already shows you) with a banner + prop card instead of stock emoji art.

## 14. HTML site + GitHub Pages deployment
**Pages (all share one menu from `nav.js`; edit `LINKS` once):**
| Page | File | Built by | Purpose |
|---|---|---|---|
| Project | `index.html` | by hand | `#preprod`, `#prod`, `#postprod` sections, thumbnail linking to the player |
| Player & output | `player.html` | `scripts/build_site.py` | dedicated player (chapters from `data.json`, speed, copy link), measured specs (length, size, LUFS/peak via ffprobe/ffmpeg), thumbnail, file table with size + download + copy-link |
| YouTube metadata | `metadata.html` | by hand | title, description, tags, pinned comment, upload settings, copy buttons + counters |
| Master spec | `spec.html` ← `MASTER_SPEC.md` | `build_site.py` | rendered Markdown in the shared menu |
| Kit pages | `kit.html`, `kitspec.html`, `skill.html`, `cheatsheet.html` | `build_site.py` | rendered Markdown of `shorts-kit/*` |
Every page also gets the floating 📝 notes panel (`nav.js`: autosave per page, copy / download / clear; key `n` opens, `Esc` closes) and `window.copyText()`.

**Markdown rendering:** GitHub Pages serves a `.md` URL as raw text (`…/MASTER_SPEC.md` stays raw). To show it formatted inside the menu, `build_site.py` embeds the Markdown as JSON in `<name>.html` and renders it with `marked` (cdnjs, pinned 12.0.2), falling back to plain text offline. **Re-run `python3 -I scripts/build_site.py` after editing any `.md` or re-rendering the video** and commit the generated `.html`.

**Deploy (GitHub Pages, from the feature branch so `main` stays untouched):**
```bash
python3 -I scripts/build_site.py && git add -A && git commit -m "…" && git push -u origin <branch>
gh api -X POST repos/<user>/<repo>/pages -f "source[branch]=<branch>" -f "source[path]=/"   # once; later pushes redeploy automatically
gh api repos/<user>/<repo>/pages -q '.status+" "+.html_url'                                   # built?
# verify the live file is the new one (Pages caches for ~1 min):
until [ "$(curl -sI "https://<user>.github.io/<repo>/short.mp4?x=$RANDOM" | grep -i content-length | tr -dc 0-9)" = "$(stat -f%z short.mp4)" ]; do sleep 5; done
open -a "Google Chrome" https://<user>.github.io/<repo>/
```
Rules: the repo must be public (or a paid plan) for Pages; **everything committed becomes public** (voice, on-camera video stills, user photos, plates blurred); keep each file < 100 MB (the MP4 is ~50 MB; the 4K source and `cam.mp4` stay out of git); `remotion/public/*` and heavy intermediates are gitignored; never commit secrets. Live URLs for this project: `https://rifaterdemsahin.github.io/200DollarAiCostLSP/` (`index.html`, `player.html`, `metadata.html`, `spec.html`, `kit.html`).

## 15. Start prompt for a new Claude session
> Use shorts-kit/MASTER_SPEC.md. Inputs: recording `<path>`, script idea `<paste>`. Last takes are the correct takes. Bootstrap with new-short.sh, build the Short with Remotion (fun, action), one index.html with preprod/prod/postprod + shared menu, a separate metadata.html, update the master spec, commit on a branch, push, deploy, give me clickable URLs.
