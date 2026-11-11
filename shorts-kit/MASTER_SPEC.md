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
One `index.html` with **three sections + a shared menu and a notes footer on every page** (`nav.js`), plus one separate `metadata.html`.
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

## 13. Start prompt for a new Claude session
> Use shorts-kit/MASTER_SPEC.md. Inputs: recording `<path>`, script idea `<paste>`. Last takes are the correct takes. Bootstrap with new-short.sh, build the Short with Remotion (fun, action), one index.html with preprod/prod/postprod + shared menu, a separate metadata.html, update the master spec, commit on a branch, push, deploy, give me clickable URLs.
