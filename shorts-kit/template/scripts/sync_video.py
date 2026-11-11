#!/usr/bin/env python3
"""Line up on-camera video with the voice recording BY WAVEFORM (camera audio is only used to find the offset,
it is never mixed), then cut + crop the matching clip to remotion/public/cam.mp4 (no audio).
Needs numpy+scipy:  python3 -m venv .venv && .venv/bin/pip install numpy scipy
Usage: .venv/bin/python scripts/sync_video.py "<camera.MP4>" "<voice.WAV>"
Reads take.start/take.end and video.crop (w:h:x:y, 9:16 crop of the 4K frame) from storyboard.json."""
import json, os, subprocess, sys, tempfile
import numpy as np, scipy.io.wavfile as w, scipy.signal as sg
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cam, wav = sys.argv[1], sys.argv[2]
sb = json.load(open(f"{R}/storyboard.json")); t0, t1 = sb["take"]["start"], sb["take"]["end"]
crop = sb.get("video", {}).get("crop", "1215:2160:1993:0")
tmp = tempfile.mkdtemp()
def pcm(src, out, sr=8000):
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i",src,"-vn","-ac","1","-ar",str(sr),"-af","highpass=f=100",out],check=True)
    return w.read(out)[1].astype(float)
a, b = pcm(cam, f"{tmp}/a.wav"), pcm(wav, f"{tmp}/b.wav")
env = lambda x, h=80: np.abs(x[:len(x)//h*h]).reshape(-1, h).mean(1)
ea, eb = env(a), env(b); ea = (ea-ea.mean())/ea.std(); eb = (eb-eb.mean())/eb.std()
c = sg.correlate(eb, ea, mode="full", method="fft"); lag = (c.argmax()-(len(ea)-1))/100       # 100 Hz envelope
conf = c.max()/np.sort(c)[-50]
print(f"voice_time = camera_time + {lag:.2f} s   (confidence {conf:.1f}x; >3 is solid)")
cs = t0 - lag
assert cs >= 0 and cs + (t1-t0) <= len(a)/8000, f"take {t0}-{t1} not inside the camera clip (camera range in voice time: {lag:.1f}-{lag+len(a)/8000:.1f})"
os.makedirs(f"{R}/remotion/public", exist_ok=True)
subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",f"{cs:.3f}","-t",f"{t1-t0+.1:.3f}","-i",cam,"-an","-vf",
  f"crop={crop},scale=1080:1920:flags=lanczos,fps=30","-c:v","libx264","-crf","20","-preset","fast","-g","15","-pix_fmt","yuv420p",f"{R}/remotion/public/cam.mp4"],check=True)
json.dump({"audio_offset": lag, "camera_start_for_take": cs}, open(f"{R}/assets/sync.json","w"))
print("wrote remotion/public/cam.mp4 (muted, take-aligned: clip t=0 == take start)")
