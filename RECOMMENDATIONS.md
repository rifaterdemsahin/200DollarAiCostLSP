---
published: false
---
# 💡 Recommendations & sanity check

_Reviewed 2026-11-11 on the current render (47.1 s, 9:16). Evidence = measured, not guessed. Menu: [Player & output](player.html) · [Metadata](metadata.html) · [Master spec](spec.html)._

## My honest take
**7 / 10 as it stands. Fun, fast, clearly yours, and the structure is right** (hook → problem → fix → joke → close, a cut every 3–5 s, your face lip-synced on the key lines). It is **not yet a video that proves its own claim** (the CTA end card is now in). The proof is cheap to fix and they decide whether the Short converts viewers into Delivery Pilot members rather than just views.

## Top recommendations (in order)
| # | Do this | Why | Effort |
|---|---|---|---|
| 1 | **Add 4–5 s of real proof**: a screen capture of Kilo showing an LSP diagnostic (wrong type / missing import) being fixed by the cheap model. Replace the drawn "squiggle" scene or cut it in after "…straight to the agent." | The whole Short claims "LSP makes a cheap model smart". Right now nothing on screen shows it working. Your own pre-prod note says to verify Kilo really passes LSP diagnostics to the agent (OpenCode does; Kilo's newer runtime shares roots). A real fix is the difference between a joke and a credible tip. | 20 min to record |
| 2 | ✅ **DONE: CTA end card** (2.6 s: Skool logo, Delivery Pilot, URL). Original note: add the CTA in the last 2–3 s: Skool logo + "Join **Delivery Pilot**", plus the pinned comment. The voice never says it. | The spec requires one CTA, named aloud **and** shown. The notes panel has it, the video does not. I can add the end card without re-recording. | 10 min (I can do it now) |
| 3 | **Tighten the first 2 seconds.** Today: 1.4 s typed card + logo wall, voice starts at 1.5 s. Try opening on the **$200 slam at frame 0** (logos as a 0.5 s flash) or start the voice at ~0.4 s. | Shorts are judged in the first 1–2 s; a silent cryptic card is the riskiest moment. Test both versions. | 15 min |
| 4 | **Remove the dead air** between sentences (0.3–0.5 s gaps) → about 42 s, punchier. | Same words, faster feel. Needs `take.cuts` entries; lip-sync stays because video and voice are cut together. | 20 min |
| 5 | **Replace or license the footballer photos.** Use for ≤ 2–3 s, or swap for an illustration/emoji gag. | They are web photos of real people on a public site and a monetised channel: copyright and likeness risk. The Land Rover photo (listing photo, plates blurred) needs the same ownership check. | 10 min |
| 6 | **Upload real captions (SRT)** to YouTube alongside the burned-in ones. | Accessibility, search and auto-translate. I can generate it from `data.json`. | 5 min |
| 7 | **Thumbnail with your face + shades + "$200 ✕"** instead of the robot emoji. | Faces and a clear number outperform generic emoji art. | 15 min |
| 8 | **Stop committing the MP4 every iteration.** Use GitHub Releases or Git LFS for `short.mp4`. | `.git` is already 172 MB (four MP4 versions). Pages still works, but clones get slow. Squashing history would shrink it; I will not rewrite history without your OK. | 10 min |

## Sanity check (spec section 10)
| Check | Result | Evidence |
|---|---|---|
| Length < 60 s | ✅ | 47.1 s |
| Hook typed on frame 0, voice ≤ 2 s | ✅ / ⚠️ | typed card at 0 s, voice at 1.5 s; see recommendation 3 |
| Last take used | ✅ | take 2 (zoom 68.2–114.4 s); first take discarded |
| Lip-sync | ✅ | camera audio vs voice lag +24.8 ms, identical in 5 windows (< 1 frame) |
| Transcript = subtitles | ✅ after fix | "a relax" → "relaxed" patched (`word_patches` in `storyboard.json`); "not" inserted in "undefined is **not** a function" |
| Subtitles don't cross sentences | ✅ after fix | groups now break at `. ! ?` |
| Overlap with subtitle zone | ✅ after fix | fixed: error-wall text vs 🤦, "LSP OFF" clipping, progress dots, black-hole text |
| Loudness | ⚠️ | −15.5 LUFS after AAC (target −14), true peak −4.4 dBFS (limit −3). YouTube normalises playback anyway |
| Broken local links | ✅ | none across all pages |
| Secrets | ✅ | the 2 grep hits are the placeholder text `fal_sk_` inside the spec, not keys |
| Starter kit works from scratch | ⚠️ → ✅ | **failed** type-check on a fresh copy (missing `data.json`/`eyes.json`); fixed by shipping placeholders |
| Repo size | ⚠️ | `.git` 172 MB (see recommendation 8) |

## Not verified (you decide)
- **Kilo actually passes LSP diagnostics to the agent** in your setup (needs the screen capture).
- **"Ronaldinho"** is the word Whisper heard, and the one you named in your notes. Listen once more to be sure the spoken name is what the caption says.
- **Distilled + LSP = "smart enough"** is opinion, framed as opinion in the description. No benchmark.
- **Delivery Pilot link** `https://www.skool.com/delivery-pilot-8938` is now in the end card, notes panel, description and pinned comment. YouTube Shorts do not make on-video links clickable, so the pinned comment/description carry the real click.
- Rights for the footballer photos, the Land Rover photo and the company logos (logos are used only to name the labs).
- I have **not watched the final file with sound start to finish**. Please do before uploading.

## What I would do next
1. Record the Kilo proof clip (recommendation 1) and let me cut it in; add the CTA end card (2).
2. Render two hook variants (3) and publish the one that holds viewers past 3 s.
3. Make the second Short with `shorts-kit/` to confirm the workflow really is "start faster".
