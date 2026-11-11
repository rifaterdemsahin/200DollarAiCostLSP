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
cuts = sorted(sb["take"].get("cuts", []))                      # zoom-time ranges removed from the take
if not os.path.exists(voice):
    keep, cur = [], t0
    for cs, ce in cuts: keep.append((cur, cs)); cur = ce
    keep.append((cur, t1))
    parts = "".join(f"[0]atrim={a}:{b},asetpts=PTS-STARTPTS,afade=t=in:d=0.012,afade=t=out:st={b-a-0.012}:d=0.012[s{i}];" for i, (a, b) in enumerate(keep))
    fc = parts + "".join(f"[s{i}]" for i in range(len(keep))) + f"concat=n={len(keep)}:v=0:a=1,highpass=f=80,afftdn=nf=-30,loudnorm=I=-14:TP=-3:LRA=7[o]"
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i",SRC,"-filter_complex",fc,"-map","[o]","-ac","1","-ar","44100",voice],check=True)
wj = json.load(open(f"{R}/assets/audio/whisper_medium.json"))
raw = [(x["word"].strip(), x["start"], x["end"]) for s in wj["segments"] for x in s["words"] if t0 <= x["start"] < t1 and not any(cs <= x["start"] < ce for cs, ce in cuts)]
def shift(t): return t - sum(ce - cs for cs, ce in cuts if t >= ce)          # zoom time -> time after cuts
FIX = {"LSP,": "LSP,", "Ronaldinho": "Ronaldinho"}
words = []
for i, (w, a, b) in enumerate(raw):
    words.append({"w": w, "s": round(shift(a) - t0 + H, 3), "e": round(shift(b) - t0 + H, 3)})
    if w == "is" and raw[i+1][0] == "a" and raw[i+2][0] == "function":   # "undefined is [not] a function"
        words[-1]["e"] = round(words[-1]["s"] + (raw[i+1][1]-raw[i][1])/2, 3)
        words.append({"w": "not", "s": words[-1]["e"], "e": round(shift(raw[i+1][1])-t0+H, 3)})
removed = sum(ce - cs for cs, ce in cuts)
dur = H + (t1 - t0) - removed + O
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
data = {"cuts": [{"at": round(cs - t0, 3), "len": round(ce - cs, 3)} for cs, ce in cuts], "cams": cams, "overlays": overlays, "fps": FPS, "total": total, "hook": int(H*FPS), "voice_delay": H, "scenes": scenes, "words": words, "title": sb["title"]}
os.makedirs(f"{R}/remotion/public", exist_ok=True)
json.dump(data, open(f"{R}/remotion/public/data.json","w"), indent=1)
json.dump(data, open(f"{R}/assets/data.json","w"), indent=1)
print(f"{len(words)} words, {total} frames ({dur:.1f}s), scenes:", [(s['id'], s['from']/FPS) for s in scenes])

if os.path.exists(f"{R}/assets/eyes.json"):
    import shutil; shutil.copy(f"{R}/assets/eyes.json", f"{R}/remotion/public/eyes.json")
if os.path.isdir(f"{R}/assets/img"):                       # user photos (ronaldo, landrover with plates blurred, ...)
    import shutil; os.makedirs(f"{R}/remotion/public/img", exist_ok=True)
    for f in os.listdir(f"{R}/assets/img"): shutil.copy(f"{R}/assets/img/{f}", f"{R}/remotion/public/img/{f}")
