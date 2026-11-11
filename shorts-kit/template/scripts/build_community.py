#!/usr/bin/env python3 -I
"""Writes skool.html (community page + LSP explainer) and patches the two pinned comments in metadata.html.
Edit the strings below, run `python3 -I scripts/build_community.py`, commit."""
import html, re, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(R)
URL = "https://www.skool.com/delivery-pilot-8938"
LSP_SHORT = """❓ What is LSP?
LSP = Language Server Protocol, the open standard behind the red squiggles in your editor. A "language server" (TypeScript, Python, Go, Rust…) checks your code and reports exact errors: wrong type, missing import, function doesn't exist. If your agent tool feeds those diagnostics back after every edit, even a cheap model fixes real errors instead of guessing."""
YT = f"""🚗 Keep the car. Give your cheap model glasses 👓

Turn on LSP in Kilo Code and a cheap model reads real errors (wrong type, missing import) instead of guessing. That's the whole trick.

{LSP_SHORT}

🚀 Want the setup, the prompts and a place to ask questions? Join Delivery Pilot, our Skool community:
{URL}

Which cheap model are you running with LSP on? Drop it below 👇"""
SK = f"""📌 START HERE: Welcome to Delivery Pilot 🚀

We help each other deliver real value with AI agents: you're the pilot, the bots do the flying.

{LSP_SHORT}
⚠️ It's not a magic switch: check that your setup really passes diagnostics to the agent, and tell us what you see.

1️⃣ Say hi: who you are, what you build, which editor + agent + model you use.
2️⃣ Share one win or one stuck point from this week (a screenshot of an LSP diagnostic the agent fixed counts!).
3️⃣ Watch the Short that started it: "Don't pay $200. Give your cheap model glasses." Then tell us what you'd change in the setup.

Rules of thumb: be kind, show your setup, no income promises, no spam. Opinions are opinions: test them on your own code.

Start from somewhere. Keep the car. 🔑"""

# ---- metadata.html: replace the two pinned boxes
s = open("metadata.html", encoding="utf-8").read()
for i, txt in ((3, YT), (4, SK)):
    s, n = re.subn(rf'(<textarea id="t{i}" rows=")\d+(" data-limit="\d+">)(.*?)(</textarea>)', lambda m: m.group(1) + str(txt.count("\n") + 5) + m.group(2) + html.escape(txt) + m.group(4), s, flags=re.S)
    assert n == 1, i
open("metadata.html", "w", encoding="utf-8").write(s)

# ---- skool.html
def card(i, label, txt):
    return f'<div class="card"><b>{label}</b><br><textarea id="p{i}" rows="{txt.count(chr(10))+6}" readonly>{html.escape(txt)}</textarea><button class="btn" onclick="copyText(document.getElementById(\'p{i}\').value);this.textContent=\'✅ Copied\'">📋 Copy</button></div>'
page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Skool community: Delivery Pilot</title><link rel="stylesheet" href="style.css"></head><body><main>
<div class="hero"><div style="background:#fff;border-radius:24px;padding:16px 28px"><img src="skool.png" alt="Skool" style="width:260px;display:block"></div>
<div style="flex:1;min-width:260px"><h1>🏫 Delivery Pilot</h1><p class="dim">Our community on Skool: you're the pilot, the AI agents do the flying.</p>
<a class="btn" href="{URL}" target="_blank" rel="noopener" style="font-size:18px">🚀 Join Delivery Pilot</a><a class="btn" href="player.html">▶️ Watch the Short</a></div></div>

<h2>❓ What is LSP?</h2>
<div class="grid"><div class="card"><h3>In one sentence</h3><p><b>LSP = Language Server Protocol</b>: an open standard (introduced by Microsoft for VS Code in 2016) that lets an editor or tool talk to a <b>language server</b> that really understands a programming language.</p>
<p>Language servers exist for most languages, e.g. <code>typescript-language-server</code>, <code>pyright</code> (Python), <code>gopls</code> (Go), <code>rust-analyzer</code> (Rust).</p></div>
<div class="card"><h3>What it gives you</h3><ul><li>🔴 <b>Diagnostics</b>: the red squiggles (errors and warnings)</li><li>🧭 Go to definition, find references</li><li>💡 Hover types, autocomplete, rename</li></ul><p class="dim">Same answers a compiler or type-checker would give, available while you type.</p></div></div>
<div class="card"><h3>Why it matters for a cheap model</h3>
<svg viewBox="0 0 640 120" width="100%" style="max-width:640px" role="img" aria-label="Agent talks to language server about your code">
<rect x="5" y="30" width="170" height="60" rx="12" fill="#2a2a45"/><text x="90" y="66" text-anchor="middle" fill="#fff" font-size="16">🤖 Agent / editor</text>
<rect x="235" y="30" width="170" height="60" rx="12" fill="#12a56a"/><text x="320" y="66" text-anchor="middle" fill="#fff" font-size="16">🔎 Language server</text>
<rect x="465" y="30" width="170" height="60" rx="12" fill="#2a2a45"/><text x="550" y="66" text-anchor="middle" fill="#fff" font-size="16">📄 Your code</text>
<path d="M175 50 H235 M405 50 H465" stroke="#ffd23f" stroke-width="3"/><path d="M235 74 H175 M465 74 H405" stroke="#ff3b4e" stroke-width="3"/>
<text x="205" y="100" text-anchor="middle" fill="#ffd23f" font-size="12">edit</text><text x="205" y="22" text-anchor="middle" fill="#ff3b4e" font-size="12">wrong type…</text></svg>
<ol><li>The agent edits a file.</li><li>The language server checks it and replies with <b>exact</b> problems: “line 12: <code>string</code> is not assignable to <code>number</code>”, “missing import”.</li><li>The model <b>reads facts instead of guessing</b>, so cheaper (distilled / open) models behave smarter.</li></ol>
<p>⚠️ <b>Not a magic switch.</b> It only helps if your tool actually passes the diagnostics to the agent (OpenCode does this out of the box; Kilo's newer runtime shares its roots, so <i>verify on your setup</i>), the right language server must be installed, and OpenCode's own docs note it is not always a net positive (extra noise, tokens, time). Test it on your own code and share what you see.</p></div>

<h2>📌 Pinned comments (copy &amp; paste)</h2>
{card(1, "YouTube pinned comment", YT)}{card(2, "Skool pinned post (inside Delivery Pilot)", SK)}
<h2>🔗 Links</h2><div class="card"><ul><li>🚀 <a href="{URL}" target="_blank" rel="noopener">{URL}</a></li><li>▶️ <a href="player.html">Player &amp; output</a> · 📺 <a href="metadata.html">YouTube metadata</a> · 💡 <a href="recommendations.html">Recommendations</a></li></ul></div>
</main><script src="nav.js"></script></body></html>'''
open("skool.html", "w", encoding="utf-8").write(page)
print("built skool.html + patched metadata.html")
