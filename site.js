// Mammoth Blocker — site script. No trackers, no cookies, no outside calls.

// =====================================================================
//  STORE LINKS — paste each link here when that store approves Mammoth.
//  Every "Get Mammoth" button on the site updates by itself.
// =====================================================================
var STORE_LINKS = {
  chrome:  "",   // e.g. https://chromewebstore.google.com/detail/mammoth-blocker/<id>
  firefox: "",   // e.g. https://addons.mozilla.org/firefox/addon/mammoth-blocker/
  edge:    ""    // e.g. https://microsoftedge.microsoft.com/addons/detail/<id>
};
// Where people download the extension to install it by hand (GitHub release zips).
var DOWNLOADS = {
  page: "https://github.com/Azna-Nemati/mammoth-extension/releases/latest"
};

(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  // ---------- year ----------
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // ---------- header: shadow on scroll, mobile menu, back to top ----------
  var header = $(".site-header"), toTop = $("#toTop");
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 4);
    if (toTop) toTop.classList.toggle("show", y > 900);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  var menuBtn = $("#menuBtn"), links = $("#navLinks");
  if (menuBtn && links) {
    menuBtn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    $$("a", links).forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------- which browser is this? ----------
  var ua = navigator.userAgent;
  var browser = "chrome", browserName = "Chrome";
  if (/Firefox\//.test(ua)) { browser = "firefox"; browserName = "Firefox"; }
  else if (/Edg\//.test(ua)) { browser = "edge"; browserName = "Edge"; }
  else if (/OPR\//.test(ua)) { browser = "brave"; browserName = "Opera"; }
  else if (navigator.brave) { browser = "brave"; browserName = "Brave"; }
  var isMobile = /Android|iPhone|iPad|iPod/i.test(ua);

  // Store link for a browser tab (Edge and Brave/Opera can use the Chrome store).
  function storeFor(b) {
    if (b === "firefox") return STORE_LINKS.firefox;
    if (b === "edge") return STORE_LINKS.edge || STORE_LINKS.chrome;
    if (b === "brave" || b === "chrome") return STORE_LINKS.chrome;
    return "";
  }

  // Point every "Get Mammoth" button straight at the store when it's live.
  var direct = !isMobile && storeFor(browser);
  $$("[data-install]").forEach(function (a) {
    if (!direct) return;
    a.href = direct;
    a.rel = "noopener";
    if (a.id === "heroInstall") a.textContent = "Add to " + browserName + " — it's free";
  });

  // ---------- install guide ----------
  var STORE_NAMES = { chrome: "Chrome Web Store", edge: "Edge Add-ons", brave: "Chrome Web Store", firefox: "Firefox Add-ons" };
  var LABELS = { chrome: "Chrome", edge: "Edge", brave: "Brave or Opera", firefox: "Firefox" };

  function storePanel(b) {
    var link = storeFor(b);
    var name = LABELS[b];
    if (link) {
      return '<span class="status live">✓ Available now</span>' +
        '<ol>' +
        '<li>Click <b>Add to ' + esc(name) + '</b> below. It opens the ' + esc(STORE_NAMES[b]) + '.</li>' +
        '<li>Click <b>Add</b> (or <b>Get</b>), then confirm.</li>' +
        '<li>Click the puzzle icon in your toolbar and pin <b>Mammoth</b> so it\'s always one click away.</li>' +
        '</ol>' +
        '<div class="row"><a class="btn btn-primary btn-lg" href="' + esc(link) + '" rel="noopener">Add to ' + esc(name) + '</a></div>';
    }
    return '<span class="status">⏳ Waiting for store approval</span>' +
      '<p style="margin-top:16px">Mammoth is being reviewed by the ' + esc(STORE_NAMES[b]) + '. The button will appear here the day it\'s approved. ' +
      'You don\'t have to wait: you can install the same version by hand in about a minute.</p>' +
      '<div class="row"><button class="btn btn-green" type="button" data-goto="manual">Install it by hand</button>' +
      '<a class="btn btn-ghost" href="https://github.com/Azna-Nemati/mammoth-extension" rel="noopener">Watch on GitHub</a></div>';
  }

  function manualPanel() {
    return '<p>Use this to try Mammoth before it\'s in the stores. It\'s the same code the stores will get.</p>' +
      '<h3 style="margin-top:22px">Chrome, Edge, Brave and Opera</h3>' +
      '<ol>' +
      '<li>Download <code>mammoth-chrome</code> zip from the <a href="' + esc(DOWNLOADS.page) + '" rel="noopener">latest release</a> and unzip it.</li>' +
      '<li>Open <code>chrome://extensions</code> (Edge: <code>edge://extensions</code>).</li>' +
      '<li>Turn on <b>Developer mode</b> (top right, or left side in Edge).</li>' +
      '<li>Click <b>Load unpacked</b> and choose the unzipped folder.</li>' +
      '<li>Pin Mammoth from the puzzle icon. Done.</li>' +
      '</ol>' +
      '<h3 style="margin-top:26px">Firefox</h3>' +
      '<ol>' +
      '<li>Download <code>mammoth-firefox</code> zip from the <a href="' + esc(DOWNLOADS.page) + '" rel="noopener">latest release</a>.</li>' +
      '<li>Open <code>about:debugging#/runtime/this-firefox</code>.</li>' +
      '<li>Click <b>Load Temporary Add-on</b> and pick the zip file.</li>' +
      '<li>Note: Firefox removes temporary add-ons when it restarts. The store version stays.</li>' +
      '</ol>' +
      '<div class="row"><a class="btn btn-green" href="' + esc(DOWNLOADS.page) + '" rel="noopener"><svg><use href="#i-save"/></svg>Download the latest release</a></div>';
  }

  var installTabs = $("#installTabs"), installPanel = $("#installPanel");
  function showInstall(b) {
    if (!installTabs) return;
    $$(".tab", installTabs).forEach(function (t) { t.setAttribute("aria-selected", String(t.dataset.b === b)); });
    installPanel.innerHTML = b === "manual" ? manualPanel() : storePanel(b);
    $$("[data-goto]", installPanel).forEach(function (btn) {
      btn.addEventListener("click", function () { showInstall(btn.dataset.goto); });
    });
  }
  if (installTabs) {
    $$(".tab", installTabs).forEach(function (t) {
      t.addEventListener("click", function () { showInstall(t.dataset.b); });
    });
    showInstall(browser);
    var note = $("#detectNote");
    if (note) note.textContent = isMobile
      ? "Mammoth is for desktop browsers. Open this page on your computer to install it."
      : "Looks like you're using " + browserName + ". We picked it for you below.";
  }

  // ---------- block list explorer ----------
  var LISTS = window.MAMMOTH_LISTS || [];
  var total = LISTS.reduce(function (n, c) { return n + c.domains.length; }, 0);
  if (total) $$("[data-total]").forEach(function (el) { el.textContent = total; });

  var catTabs = $("#catTabs"), catPanel = $("#catPanel");
  var SHOW = 36;
  function showCat(id, all) {
    var c = LISTS.filter(function (x) { return x.id === id; })[0];
    if (!c) return;
    $$(".tab", catTabs).forEach(function (t) { t.setAttribute("aria-selected", String(t.dataset.c === id)); });
    var list = all ? c.domains : c.domains.slice(0, SHOW);
    var html = '<div class="panel-head"><h3>' + esc(c.name) + '</h3><span class="count">' + c.domains.length + ' domains</span></div>' +
      '<p class="desc">' + esc(c.desc) + '</p><div class="domains">' +
      list.map(function (d) { return "<span>" + esc(d) + "</span>"; }).join("");
    if (!all && c.domains.length > SHOW) html += '<button class="more" type="button">Show all ' + c.domains.length + ' →</button>';
    html += "</div>";
    if (!c.on) html += '<p class="off-note">This list is off by default. Turn it on in Mammoth\'s Options.</p>';
    catPanel.innerHTML = html;
    var more = $(".more", catPanel);
    if (more) more.addEventListener("click", function () { showCat(id, true); });
  }
  if (catTabs && LISTS.length) {
    catTabs.innerHTML = LISTS.map(function (c, i) {
      return '<button class="tab" role="tab" data-c="' + c.id + '" aria-selected="' + (i === 0) + '">' +
        esc(c.name) + '<span class="c">' + c.domains.length + "</span></button>";
    }).join("");
    $$(".tab", catTabs).forEach(function (t) { t.addEventListener("click", function () { showCat(t.dataset.c); }); });
    showCat(LISTS[0].id);
  }

  // ---------- "does Mammoth block this?" checker ----------
  function cleanDomain(input) {
    var d = String(input || "").trim().toLowerCase();
    d = d.replace(/^[a-z][a-z0-9+.-]*:\/\//, "").split(/[\/?#]/)[0].split("@").pop().split(":")[0];
    d = d.replace(/^www\./, "").replace(/\.$/, "");
    return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(d) ? d : "";
  }
  function lookup(domain) {
    for (var i = 0; i < LISTS.length; i++) {
      var c = LISTS[i];
      for (var j = 0; j < c.domains.length; j++) {
        var rule = c.domains[j];
        if (domain === rule || domain.slice(-(rule.length + 1)) === "." + rule) return { cat: c, rule: rule };
      }
    }
    return null;
  }
  var form = $("#checkForm"), input = $("#checkInput"), out = $("#checkResult");
  function runCheck() {
    var d = cleanDomain(input.value);
    if (!d) {
      out.innerHTML = '<div class="result bad"><svg><use href="#i-alert"/></svg><div>That doesn\'t look like a website address. Try something like <b>example.com</b>.</div></div>';
      return;
    }
    var hit = lookup(d);
    if (hit) {
      var extra = hit.rule !== d ? " (it's part of <b>" + esc(hit.rule) + "</b>)" : "";
      var off = hit.cat.on ? "" : " This list is off by default — turn it on in Options.";
      out.innerHTML = '<div class="result blocked"><svg><use href="#i-shield"/></svg><div><b>' + esc(d) + '</b> is blocked by Mammoth' + extra +
        '. Category: <b>' + esc(hit.cat.name) + '</b>.' + off + '</div></div>';
    } else {
      out.innerHTML = '<div class="result clear"><svg><use href="#i-check"/></svg><div><b>' + esc(d) + '</b> is not on Mammoth\'s lists, so it loads normally. ' +
        'Think it should be blocked? <a href="https://github.com/Azna-Nemati/mammoth-extension/issues/new?title=' +
        encodeURIComponent("Suggest a domain: " + d) + '" rel="noopener">Suggest it</a>.</div></div>';
    }
  }
  if (form) {
    form.addEventListener("submit", function (e) { e.preventDefault(); runCheck(); });
    $$("[data-try]").forEach(function (b) {
      b.addEventListener("click", function () { input.value = b.dataset.try; runCheck(); });
    });
  }

  // ---------- FAQ search ----------
  var faqSearch = $("#faqSearch"), faqList = $("#faqList"), faqEmpty = $("#faqEmpty");
  if (faqSearch && faqList) {
    faqSearch.addEventListener("input", function () {
      var q = faqSearch.value.trim().toLowerCase(), shown = 0;
      $$("details", faqList).forEach(function (d) {
        var match = !q || d.textContent.toLowerCase().indexOf(q) !== -1;
        d.hidden = !match;
        if (match) shown++;
        if (q && match && q.length > 2) d.open = true;
      });
      faqEmpty.hidden = shown !== 0;
    });
  }
})();
