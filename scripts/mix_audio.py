#!/usr/bin/env python3 -I
"""Synthesize a 120bpm beat + SFX (no API, no cost) and mix under the cleaned voice.
Output: assets/audio/mix.wav and remotion/public/mix.wav   Needs ffmpeg (only for the final ducking mix)."""
import json, math, os, random, struct, subprocess, wave
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(f"{R}/assets/data.json"))
SR = 44100; DUR = D["total"] / D["fps"]; N = int(SR * DUR)
random.seed(7)
def bus(): return [0.0] * N
def add(b, t, samples, g=1.0):
    i = int(t * SR)
    for k, v in enumerate(samples):
        if 0 <= i + k < N: b[i + k] += v * g
def kick(): return [math.sin(2*math.pi*(50+90*math.exp(-k/900))*k/SR) * math.exp(-k/5000) for k in range(int(.25*SR))]
def hat():  return [(random.random()*2-1) * math.exp(-k/700) * .5 for k in range(int(.06*SR))]
def snare(): return [((random.random()*2-1)*.7 + math.sin(2*math.pi*190*k/SR)*.4) * math.exp(-k/2600) for k in range(int(.18*SR))]
def bass(f): return [math.tanh(2*math.sin(2*math.pi*f*k/SR)) * .5 * min(1, k/200) * math.exp(-k/7000) for k in range(int(.4*SR))]
def whoosh(d=.45):
    out, lp = [], 0.0
    for k in range(int(d*SR)):
        env = math.sin(math.pi * k / (d*SR)) ** 2
        lp += (random.random()*2-1 - lp) * (.02 + .5 * k/(d*SR))
        out.append(lp * env * 2.2)
    return out
def ding(f=1318):  return [(math.sin(2*math.pi*f*k/SR) + .4*math.sin(2*math.pi*f*2*k/SR)) * math.exp(-k/6000) * .5 for k in range(int(.5*SR))]
def snap():  return [(random.random()*2-1) * math.exp(-k/260) * .9 for k in range(int(.05*SR))]
def jingle(): # keys: bright metallic clinks
    out = [0.0] * int(.9*SR)
    for j, t in enumerate([0, .08, .15, .27, .33, .46]):
        f = random.choice([3200, 4100, 5200, 6100])
        for k in range(int(.18*SR)):
            if int(t*SR)+k < len(out): out[int(t*SR)+k] += math.sin(2*math.pi*f*k/SR) * math.exp(-k/1400) * .35
    return out
def slam(): return [math.sin(2*math.pi*(70-40*k/(.4*SR))*k/SR) * math.exp(-k/4500) + (random.random()*2-1)*math.exp(-k/900)*.6 for k in range(int(.45*SR))]
mus, sfx = bus(), bus()
beat = 60/120; notes = [55, 55, 65.4, 49]
t, bar = D["voice_delay"] - .5, 0
while t < DUR - .2:
    for q in range(4):
        tt = t + q*beat
        add(mus, tt, kick(), .9 if q % 2 == 0 else .0)
        add(mus, tt + beat/2, hat(), .5); add(mus, tt, hat(), .25)
        if q % 2 == 1: add(mus, tt, snare(), .6)
        add(mus, tt, bass(notes[bar % 4]), .8)
    t += 4*beat; bar += 1
for s in D["scenes"]:
    ts = s["from"] / D["fps"]
    add(sfx, ts - .05, whoosh(), .55)
    if s["type"] == "price": add(sfx, ts + .5, slam(), .9)
    if s["type"] == "errors": add(sfx, ts + .2, slam(), .6)
    if s["type"] == "toggle": add(sfx, ts + 1.2, snap(), 1.0); add(sfx, ts + 1.25, ding(880), .8)
    if s["type"] == "fixes":
        dd = s["dur"] / D["fps"] / 3
        for i in range(3): add(sfx, ts + i*dd + .15, snap(), 1.0); add(sfx, ts + i*dd + .2, ding(1046 + 200*i), .8)
    if s["type"] == "smart": add(sfx, ts + .4, ding(1568), .8)
add(sfx, .0, slam(), .5)
for c in D.get("cams", []):                      # video cut-in whoosh; Land Rover arrival gets the key jingle
    add(sfx, c["from"]/D["fps"] - .05, whoosh(.3), .6)
    if c["id"] == "landrover": add(sfx, c["from"]/D["fps"] + .8, jingle(), 1.0)
    if c["id"] == "shades": add(sfx, c["from"]/D["fps"] + 1.4, ding(1568), .8)
for o in D.get("overlays", []):
    if o["id"] == "bank": add(sfx, o["from"]/D["fps"] + .2, ding(1760), .9); add(sfx, o["from"]/D["fps"] + .45, ding(2093), .9)
    if o["id"] == "cta": add(sfx, o["from"]/D["fps"] + .05, whoosh(.35), .6); add(sfx, o["from"]/D["fps"] + .4, ding(1568), .9)
    if o["id"] == "ronaldinho": add(sfx, o["from"]/D["fps"], snap(), 1.0)
def wr(path, b, g):
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", max(-32767, min(32767, int(v*g*32767)))) for v in b))
A = f"{R}/assets/audio"
wr(f"{A}/music.wav", mus, .5); wr(f"{A}/sfx.wav", sfx, .8)
d = D["voice_delay"] * 1000
cmd = ["ffmpeg","-y","-loglevel","error","-i",f"{A}/voice_clean.wav","-i",f"{A}/music.wav","-i",f"{A}/sfx.wav","-filter_complex",
  f"[0]adelay={int(d)}:all=1,apad=whole_dur={DUR}[v];[v]asplit[v1][v2];[1]afade=t=in:d=1:st=0,afade=t=out:d=2:st={DUR-2},volume=.7[m];"
  f"[m][v2]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[md];[2]volume=.8[x];"
  f"[v1][md][x]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-2:LRA=9,atrim=0:{DUR}[o]","-map","[o]","-ar","44100","-ac","2",f"{A}/mix.wav"]
subprocess.run(cmd, check=True)
subprocess.run(["cp", f"{A}/mix.wav", f"{R}/remotion/public/mix.wav"], check=True)
print(subprocess.run(["ffmpeg","-i",f"{A}/mix.wav","-af","ebur128=peak=true","-f","null","-"],capture_output=True,text=True).stderr.split("Summary:")[-1][-330:])
