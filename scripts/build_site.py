#!/usr/bin/env python3 -I
"""Generate the static site pages that share the menu (nav.js):
  - player.html : dedicated player + output files (sizes, measured specs, chapters from data.json)
  - spec.html, kitspec.html, kit.html, skill.html, cheatsheet.html : Markdown rendered in the same shared menu
Re-run after editing any .md or re-rendering the video.  Usage: python3 -I scripts/build_site.py"""
import html, json, os, subprocess, datetime, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(R)
HEAD = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>%s</title><link rel="stylesheet" href="style.css"></head><body><main>'
TAIL = '</main><script src="nav.js"></script></body></html>'

# ---------- markdown pages ----------
MD = {"recommendations.html": ("RECOMMENDATIONS.md", "Recommendations & sanity check"), "spec.html": ("MASTER_SPEC.md", "Master spec"), "kitspec.html": ("shorts-kit/MASTER_SPEC.md", "Kit master spec v2"),
      "kit.html": ("shorts-kit/README.md", "Starter kit"), "skill.html": ("shorts-kit/skills/new-short/SKILL.md", "Skill: new-short"),
      "cheatsheet.html": ("shorts-kit/syntax/cheatsheet.md", "Syntax cheatsheet")}
for page, (src, title) in MD.items():
    if not os.path.exists(src): continue
    text = open(src, encoding="utf-8").read()
    text = re.sub(r"^---\n.*?\n---\n", "", text, count=1, flags=re.S)           # drop front matter (SKILL.md)
    j = json.dumps(text).replace("</", "<\\/")
    open(page, "w", encoding="utf-8").write(HEAD % html.escape(title) + f'''<p class="dim">Rendered from <a href="{src}"><code>{src}</code></a> (raw file) · <a href="https://github.com/rifaterdemsahin/200DollarAiCostLSP/blob/lsp-short-v1/{src}">GitHub</a></p>
<article id="md" class="md">Loading…</article>
<script src="https://cdnjs.cloudflare.com/ajax/libs/marked/12.0.2/marked.min.js"></script>
<script>const MD={j};const el=document.getElementById("md");
if(window.marked){{el.innerHTML=marked.parse(MD,{{gfm:true}});}}else{{el.innerHTML="<pre style='white-space:pre-wrap'></pre>";el.firstChild.textContent=MD;}}
el.querySelectorAll("h1,h2,h3").forEach(h=>{{h.id=h.textContent.toLowerCase().replace(/[^\\w]+/g,"-").replace(/^-|-$/g,"")}});
el.querySelectorAll("a[href]").forEach(a=>{{const h=a.getAttribute("href");if(/^[^#:]+\\.md$/.test(h)){{const m={{"MASTER_SPEC.md":"spec.html","shorts-kit/README.md":"kit.html","shorts-kit/MASTER_SPEC.md":"kitspec.html"}}[h.replace(/^\\.\\//,"")];if(m)a.href=m}}}});
</script>''' + TAIL)

# ---------- player + output page ----------
D = json.load(open("assets/data.json")); fps = D["fps"]
def fmt(b): return f"{b/1e6:.1f} MB" if b > 1e6 else f"{b/1e3:.0f} KB"
def probe():
    o = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_name,width,height,r_frame_rate", "-of", "json", "short.mp4"], capture_output=True, text=True).stdout
    return json.loads(o)
pr = probe(); v = next(s for s in pr["streams"] if s.get("width")); dur = float(pr["format"]["duration"])
e = subprocess.run(["ffmpeg", "-i", "short.mp4", "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
lufs = re.findall(r"I:\s+(-?[\d.]+) LUFS", e)[-1]; tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", e)[-1]
LAB = {"price": "$200 slam", "commute": "Gets me to work", "errors": "Error wall", "guess": "Cheap models guess", "toggle": "LSP on", "squiggle": "Squiggles to agent",
       "fixes": "Wrong type · missing import · fixed", "smart": "Smart enough", "blackhole": "Token black hole", "wallet": "Wallet relaxed", "keep": "Keep the car"}
chap = [("Hook · AI lab logos", 0.0)] + [(LAB.get(s["type"], s["type"]), s["from"] / fps) for s in D["scenes"]]
chips = "".join(f'<button class="btn ch" data-t="{t:.2f}">{int(t//60)}:{int(t%60):02d} {html.escape(n)}</button>' for n, t in chap)
FILES = [("short.mp4", "Final video (H.264 + AAC, 9:16)"), ("thumbnail.png", "Thumbnail 1080×1920"), ("assets/audio/voice_clean.wav", "Cleaned voice (last take, cuts applied)"),
         ("assets/data.json", "Scene + word timings (drives Remotion)"), ("storyboard.json", "Storyboard: take, cuts, cams, overlays"), ("assets/eyes.json", "Eye-tracking data for the sunglasses"),
         ("metadata.html", "YouTube metadata page"), ("MASTER_SPEC.md", "Master spec (raw Markdown)")]
rows = "".join(f'<tr><td><a href="{f}">{f}</a></td><td>{html.escape(d)}</td><td>{fmt(os.path.getsize(f))}</td><td><a class="btn" href="{f}" download>⬇️</a><button class="btn" onclick="copyText(new URL(\'{f}\',location.href).href);this.textContent=\'✅\'">🔗</button></td></tr>' for f, d in FILES if os.path.exists(f))
open("player.html", "w", encoding="utf-8").write(HEAD % "Player and output" + f'''<h1>▶️ Player &amp; output</h1>
<div class="hero"><div><video id="v" src="short.mp4" poster="thumbnail.png" controls playsinline preload="metadata" style="width:340px;max-width:100%"></video>
<div style="margin-top:8px"><button class="btn sp" data-s=".5">0.5×</button><button class="btn sp" data-s="1">1×</button><button class="btn sp" data-s="1.5">1.5×</button><a class="btn" href="short.mp4" download>⬇️ Video</a><button class="btn" onclick="copyText(new URL('short.mp4',location.href).href);this.textContent='✅ link copied'">🔗 Copy link</button></div></div>
<div style="flex:1;min-width:260px"><h3>Chapters</h3><div id="chaps">{chips}</div><p class="cnt" id="now"></p></div></div>
<h2>Output</h2>
<div class="grid"><div class="card"><h3>Measured</h3><table><tr><th>Length</th><td>{dur:.2f} s (limit 60)</td></tr><tr><th>Size</th><td>{v["width"]}×{v["height"]} · {v["codec_name"]}</td></tr><tr><th>Loudness</th><td>{lufs} LUFS · true peak {tp} dBFS</td></tr><tr><th>Scenes</th><td>{len(D["scenes"])} + hook · {len(D.get("cams", []))} camera cuts</td></tr><tr><th>Built</th><td>{datetime.datetime.now().strftime("%Y-%m-%d %H:%M")}</td></tr></table></div>
<div class="card"><h3>Thumbnail</h3><img src="thumbnail.png" alt="thumbnail" style="width:180px;border-radius:12px"><br><a class="btn" href="thumbnail.png" download>⬇️ Download</a></div></div>
<div class="card"><h3>Files</h3><table><tr><th>File</th><th>What</th><th>Size</th><th></th></tr>{rows}</table></div>
<script>const v=document.getElementById("v");
document.querySelectorAll(".ch").forEach(b=>b.onclick=()=>{{v.currentTime=+b.dataset.t;v.play()}});
document.querySelectorAll(".sp").forEach(b=>b.onclick=()=>v.playbackRate=+b.dataset.s);
const cs=[...document.querySelectorAll(".ch")];
v.ontimeupdate=()=>{{let k=0;cs.forEach((c,i)=>{{if(v.currentTime>=+c.dataset.t-.05)k=i}});cs.forEach((c,i)=>c.style.outline=i===k?"3px solid #fff":"none");document.getElementById("now").textContent="now: "+cs[k].textContent}};</script>''' + TAIL)
print("built:", ["player.html"] + [p for p in MD if os.path.exists(p)])
