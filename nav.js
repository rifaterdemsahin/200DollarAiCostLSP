// Shared menu: included by every page. Edit LINKS once, all pages update.
(function () {
  const LINKS = [
    ["index.html#preprod", "1 · Pre-prod"], ["index.html#prod", "2 · Prod"], ["index.html#postprod", "3 · Post-prod"],
    ["player.html", "▶️ Player & output"], ["metadata.html", "YouTube metadata"], ["spec.html", "Master spec"], ["kit.html", "Starter kit"], ["kitspec.html", "Kit spec v2"],
  ];
  const here = location.pathname.split("/").pop() || "index.html";
  const nav = document.createElement("nav");
  nav.innerHTML = `<b>🚗 $200 LSP Short</b>` + LINKS.map(([h, t]) => `<a href="${h}" ${h.split("#")[0] === here ? 'class="on"' : ""}>${t}</a>`).join("");
  document.body.prepend(nav);
})();

// Floating notes (all pages): 📝 button bottom-right opens a panel. Autosaves per page (localStorage). Copy / download / clear.
(function () {
  const page = location.pathname.split("/").pop() || "index.html";
  const key = "notes:" + page, openKey = "notes-open";
  const wrap = document.createElement("div");
  wrap.id = "notes";
  wrap.innerHTML = `<button id="note-fab" title="Notes (n)" aria-label="Open notes">📝</button>
    <div id="note-panel" hidden><div class="np-head"><b>📝 Notes — ${page}</b><button id="note-x" aria-label="Close">✕</button></div>
      <textarea id="note-box" rows="9" placeholder="Take notes here (saved in this browser)…"></textarea>
      <div class="np-row"><button class="btn" id="note-copy">📋 Copy</button><button class="btn" id="note-dl">⬇️ Download</button><button class="btn" id="note-clear">🗑️ Clear</button></div>
      <div class="cnt" id="note-st"></div>
      <a class="np-cta" href="https://www.skool.com" target="_blank" rel="noopener"><img src="skool.png" alt="Skool"><span>Join our Skool community<br><b>Delivery Pilot</b></span></a></div>`;
  document.body.appendChild(wrap);
  // what gets copied / downloaded: page reference on top, community CTA at the end
  const CTA = "Join our Skool community: Delivery Pilot 🚀";
  const out = () => "📝 Notes — " + (document.title || page) + "\n🔗 " + location.href.split("?")[0] + "\n🕒 " + new Date().toLocaleString() + "\n\n" + box.value.trim() + "\n\n— — —\n" + CTA + "\n";
  const $ = (id) => wrap.querySelector(id), box = $("#note-box"), st = $("#note-st"), panel = $("#note-panel");
  const say = (m) => { st.textContent = m; };
  try { box.value = localStorage.getItem(key) || ""; if (localStorage.getItem(openKey) === "1") panel.hidden = false; } catch (e) {}
  const toggle = (v) => { panel.hidden = v === undefined ? !panel.hidden : !v; try { localStorage.setItem(openKey, panel.hidden ? "0" : "1"); } catch (e) {} if (!panel.hidden) box.focus(); };
  $("#note-fab").onclick = () => toggle(); $("#note-x").onclick = () => toggle(false);
  document.addEventListener("keydown", (e) => { if (e.key === "n" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && !e.metaKey && !e.ctrlKey) { e.preventDefault(); toggle(true); } if (e.key === "Escape") toggle(false); });
  box.addEventListener("input", () => { try { localStorage.setItem(key, box.value); say("saved " + new Date().toLocaleTimeString()); } catch (e) { say("not saved: storage blocked"); } });
  // copy to clipboard (works on https/localhost; falls back to execCommand on file://)
  $("#note-copy").onclick = async () => {
    if (!box.value.trim()) return say("nothing to copy"); const t = out();
    try { await window.copyText(t); say("✅ copied (with page + CTA)"); }
    catch (e) { say("copy blocked: press Cmd/Ctrl+C"); }
  };
  $("#note-dl").onclick = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([out()], { type: "text/plain" })); a.download = "notes-" + page.replace(".html", "") + ".txt"; a.click(); };
  $("#note-clear").onclick = () => { if (box.value && !confirm("Clear notes for this page?")) return; box.value = ""; try { localStorage.removeItem(key); } catch (e) {} say("cleared"); };
  // also: any <textarea> / .copy-btn on the page can use window.copyText(text)
  window.copyText = async (t) => { try { await navigator.clipboard.writeText(t); } catch (e) { const x = document.createElement("textarea"); x.value = t; document.body.appendChild(x); x.select(); document.execCommand("copy"); x.remove(); } };
})();
