// Shared menu: included by every page. Edit LINKS once, all pages update.
(function () {
  const LINKS = [
    ["index.html#preprod", "1 · Pre-prod"], ["index.html#prod", "2 · Prod"], ["index.html#postprod", "3 · Post-prod"],
    ["metadata.html", "YouTube metadata"], ["MASTER_SPEC.md", "Master spec"], ["shorts-kit/README.md", "Starter kit"],
  ];
  const here = location.pathname.split("/").pop() || "index.html";
  const nav = document.createElement("nav");
  nav.innerHTML = `<b>🚗 $200 LSP Short</b>` + LINKS.map(([h, t]) => `<a href="${h}" ${h.split("#")[0] === here ? 'class="on"' : ""}>${t}</a>`).join("");
  document.body.prepend(nav);
})();

// Shared footer: note-taking box on every page. Autosaves per page in this browser (localStorage).
(function () {
  const page = location.pathname.split("/").pop() || "index.html";
  const key = "notes:" + page;
  const f = document.createElement("footer");
  f.id = "notes";
  f.innerHTML = `<div class="notes-in"><b>📝 Notes — ${page}</b>
    <textarea id="note-box" rows="4" placeholder="Take notes here (saved in this browser)…"></textarea>
    <div><button class="btn" id="note-dl">⬇️ Download notes</button><button class="btn" id="note-clear">🗑️ Clear</button><span class="cnt" id="note-st"></span></div></div>`;
  document.body.appendChild(f);
  const box = f.querySelector("#note-box"), st = f.querySelector("#note-st");
  try { box.value = localStorage.getItem(key) || ""; } catch (e) {}
  box.addEventListener("input", () => { try { localStorage.setItem(key, box.value); st.textContent = " saved " + new Date().toLocaleTimeString(); } catch (e) { st.textContent = " (not saved: storage blocked)"; } });
  f.querySelector("#note-dl").onclick = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([box.value], { type: "text/plain" })); a.download = "notes-" + page.replace(".html", "") + ".txt"; a.click(); };
  f.querySelector("#note-clear").onclick = () => { if (box.value && !confirm("Clear notes for this page?")) return; box.value = ""; try { localStorage.removeItem(key); } catch (e) {} };
})();
