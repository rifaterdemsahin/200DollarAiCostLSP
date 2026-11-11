#!/usr/bin/env python3 -I
"""Cut the chosen take, build remotion/public/data.json (scene + word timings).
Usage: python3 -I scripts/prep_remotion.py
Needs: ffmpeg, assets/audio/whisper_medium.json, source WAV path in SRC env or default below."""
import json, os, subprocess, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sb = json.load(open(f"{R}/storyboard.json"))
SRC = os.environ.get("SRC", os.path.expanduser("~/Downloads/200 ai sub lsp/") + sb["take"]["source"])
t0, t1 = sb["take"]["start"], sb["take"]["end"]
H, O = sb["hook_seconds"], sb["outro_seconds"]
FPS = 30
os.makedirs(f"{R}/assets/audio", exist_ok=True)
voice = f"{R}/assets/audio/voice_clean.wav"
if not os.path.exists(voice):
    subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",str(t0),"-t",str(t1-t0),"-i",SRC,"-ac","1","-ar","44100",
        "-af","highpass=f=80,afftdn=nf=-30,loudnorm=I=-14:TP=-3:LRA=7",voice],check=True)
wj = json.load(open(f"{R}/assets/audio/whisper_medium.json"))
raw = [(x["word"].strip(), x["start"], x["end"]) for s in wj["segments"] for x in s["words"] if t0 <= x["start"] < t1]
FIX = {"LSP,": "LSP,", "Ronaldinho": "Ronaldinho"}
words = []
for i, (w, a, b) in enumerate(raw):
    words.append({"w": w, "s": round(a - t0 + H, 3), "e": round(b - t0 + H, 3)})
    if w == "is" and raw[i+1][0] == "a" and raw[i+2][0] == "function":   # "undefined is [not] a function"
        words[-1]["e"] = round(words[-1]["s"] + (raw[i+1][1]-raw[i][1])/2, 3)
        words.append({"w": "not", "s": words[-1]["e"], "e": round(raw[i+1][1]-t0+H, 3)})
dur = H + (t1 - t0) + O
total = int(round(dur * FPS))
starts = []
for sc in sb["scenes"]:
    word, _, nth = sc["start_word"].partition("#")   # "the#2" = 2nd occurrence
    hits = [x for x in words if x["w"].strip(".,").lower() == word.lower() and x["s"] >= (starts[-1]+0.5 if starts else 0)]
    first = hits[int(nth or 1) - 1]
    starts.append(first["s"] - 0.12)
scenes = []
for i, sc in enumerate(sb["scenes"]):
    a = starts[i] if i else H - 0.12
    b = starts[i+1] if i+1 < len(starts) else dur
    scenes.append({"id": sc["id"], "type": sc["type"], "from": int(a*FPS), "dur": int(b*FPS) - int(a*FPS)})
cams = [{"id": c["id"], "from": int(c["from"]*FPS), "dur": int((c["to"]-c["from"])*FPS)} for c in sb.get("cams", [])]
overlays = [{"id": o["id"], "from": int(o["from"]*FPS), "dur": int((o["to"]-o["from"])*FPS)} for o in sb.get("overlays", [])]
data = {"cams": cams, "overlays": overlays, "fps": FPS, "total": total, "hook": int(H*FPS), "voice_delay": H, "scenes": scenes, "words": words, "title": sb["title"]}
os.makedirs(f"{R}/remotion/public", exist_ok=True)
json.dump(data, open(f"{R}/remotion/public/data.json","w"), indent=1)
json.dump(data, open(f"{R}/assets/data.json","w"), indent=1)
print(f"{len(words)} words, {total} frames ({dur:.1f}s), scenes:", [(s['id'], s['from']/FPS) for s in scenes])
