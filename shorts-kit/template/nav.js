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
