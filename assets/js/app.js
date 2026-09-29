/* Lernpfad Präsentieren – gemeinsame Logik für alle Seiten.
 * - Navigation (Seitenleiste, Vor/Zurück) aus MODULES
 * - Umschalter PowerPoint 365 / OnlyOffice / beide
 * - schematische Menüband-Grafiken (figure.rb) und Seitenleisten (figure.sp)
 * - Screenshot-Platzhalter (figure.shot)
 * - Video-/Hilfe-Links aus der zentralen Liste in videos.js (div.media)
 * - Checklisten, Kurz-Checks, "Modul erledigt" – gespeichert im Browser
 */
(function () {
  "use strict";

  var LEVELS = {
    einsteiger: { name: "Einsteiger", color: "var(--lv-e)", start: "e1-oberflaeche.html" },
    fortgeschrittene: { name: "Fortgeschrittene", color: "var(--lv-f)", start: "f1-uebergaenge.html" },
    profis: { name: "Profis", color: "var(--lv-p)", start: "p1-folienmaster.html" }
  };

  var MODULES = [
    { id: "e1", level: "einsteiger", file: "e1-oberflaeche.html", title: "Oberfläche kennenlernen & speichern", min: 25 },
    { id: "e2", level: "einsteiger", file: "e2-folien.html", title: "Folien anlegen & Layouts", min: 25 },
    { id: "e3", level: "einsteiger", file: "e3-text.html", title: "Text gestalten", min: 30 },
    { id: "e4", level: "einsteiger", file: "e4-design.html", title: "Design & Hintergrund", min: 25 },
    { id: "e5", level: "einsteiger", file: "e5-bilder-formen.html", title: "Bilder, Formen & Textfelder", min: 35 },
    { id: "e6", level: "einsteiger", file: "e6-praesentieren.html", title: "Präsentieren & als PDF weitergeben", min: 20 },
    { id: "em", level: "einsteiger", file: "em-meilenstein.html", title: "Meilenstein: Deine erste Präsentation", min: 20, milestone: true },

    { id: "f1", level: "fortgeschrittene", file: "f1-uebergaenge.html", title: "Folienübergänge", min: 20 },
    { id: "f2", level: "fortgeschrittene", file: "f2-animationen.html", title: "Animationen", min: 30 },
    { id: "f3", level: "fortgeschrittene", file: "f3-ausrichten.html", title: "Ausrichten, Anordnen, Gruppieren", min: 25 },
    { id: "f4", level: "fortgeschrittene", file: "f4-tabellen-diagramme.html", title: "Tabellen & Diagramme", min: 30 },
    { id: "f5", level: "fortgeschrittene", file: "f5-smartart.html", title: "SmartArt: Inhalte visualisieren", min: 20 },
    { id: "f6", level: "fortgeschrittene", file: "f6-fusszeile-links.html", title: "Fußzeile, Foliennummern & Links", min: 15 },
    { id: "f7", level: "fortgeschrittene", file: "f7-vortragen.html", title: "Vortragen: Notizen, Referentenansicht, Handzettel", min: 20 },
    { id: "fm", level: "fortgeschrittene", file: "fm-meilenstein.html", title: "Meilenstein: Erklär-Präsentation mit Kurzvortrag", min: 20, milestone: true },

    { id: "p1", level: "profis", file: "p1-folienmaster.html", title: "Folienmaster: deine eigene Vorlage", min: 40 },
    { id: "p2", level: "profis", file: "p2-morphen.html", title: "Morphen: flüssige Verwandlungen", min: 30 },
    { id: "p3", level: "profis", file: "p3-interaktiv.html", title: "Interaktiv: Trigger, Sprungmarken, Quiz", min: 40 },
    { id: "p4", level: "profis", file: "p4-audio-video.html", title: "Audio & Video", min: 25 },
    { id: "p5", level: "profis", file: "p5-barrierefrei-teamarbeit.html", title: "Barrierefrei & im Team arbeiten", min: 25 },
    { id: "pm", level: "profis", file: "pm-meilenstein.html", title: "Meilenstein: Profi-Projekt", min: 20, milestone: true }
  ];

  // Abgabeformular (Nextcloud Forms) für alle Meilensteine. Leer lassen = kein Knopf.
  var ABGABE_LINK = "https://cloud.bbz-rd-eck.de/apps/forms/s/TwSkGeRGmxoHJ848zHaZRC3i";

  var EXTRA = [
    { file: "regeln.html", title: "Spickzettel: Gute Folien" },
    { file: "videos.html", title: "Videos & Hilfeseiten" },
    { file: "lehrkraefte.html", title: "Für Lehrkräfte" }
  ];

  // Registerkarten der Menübänder (Stand: PowerPoint für Microsoft 365, OnlyOffice Docs 8/9)
  var TABS = {
    ppt: ["Datei", "Start", "Einfügen", "Zeichnen", "Entwurf", "Übergänge", "Animationen", "Bildschirmpräsentation", "Aufzeichnen", "Überprüfen", "Ansicht", "Hilfe"],
    oo: ["Datei", "Startseite", "Einfügen", "Zeichnen", "Design", "Übergänge", "Animation", "Zusammenarbeit", "Ansicht", "Schützen", "Plugins"]
  };
  var APPNAME = { ppt: "PowerPoint 365", oo: "OnlyOffice" };

  window.LP = { MODULES: MODULES, LEVELS: LEVELS };

  // ---------- Moodle-Paket (SCORM) ----------
  // Im Moodle-Paket setzt das Build-Skript LP_SCORM_CONFIG (enthaltene Dateien, Startseite);
  // scorm.js stellt LP_SCORM bereit. In der Web-Version gibt es beides nicht.
  var PKG = window.LP_SCORM_CONFIG || null;
  var SC = window.LP_SCORM && window.LP_SCORM.active ? window.LP_SCORM : null;
  function inPackage(file) { return !PKG || PKG.files.indexOf(file) > -1; }

  // ---------- Speicher (robust, falls localStorage gesperrt ist) ----------
  // Web: alles im localStorage. Moodle: Fortschritt in der Lernplattform,
  // nur die Programmwahl im localStorage (gilt so für alle Module des Kurses).
  var KEY = "lernpfad-praesentieren-v1";
  var APPKEY = KEY + ":app";
  var state = { done: {}, checks: {}, notes: {}, selfcheck: {}, quiz: {}, app: "ppt" };
  function applyStored(parsed) {
    if (!parsed) return;
    state.done = parsed.done || {};
    state.checks = parsed.checks || {};
    state.notes = parsed.notes || {};
    state.selfcheck = parsed.selfcheck || {};
    state.quiz = parsed.quiz || {};
    if (parsed.app) state.app = parsed.app;
  }
  try {
    if (SC) {
      applyStored(SC.load());
      state.app = localStorage.getItem(APPKEY) || state.app;
    } else {
      var raw = localStorage.getItem(KEY);
      if (raw) applyStored(JSON.parse(raw));
    }
  } catch (e) { /* ohne Speicher weiterarbeiten */ }
  function save() {
    if (SC) {
      SC.save({ done: state.done, checks: state.checks, notes: state.notes, quiz: state.quiz });
      try { localStorage.setItem(APPKEY, state.app); } catch (e) { /* ignorieren */ }
      return;
    }
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignorieren */ }
  }
  LP.state = state;
  LP.save = save;

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // ---------- App-Umschalter ----------
  function setApp(app) {
    state.app = app;
    document.documentElement.setAttribute("data-app", app);
    var btns = document.querySelectorAll(".app-switch button");
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute("aria-pressed", btns[i].dataset.app === app ? "true" : "false");
    save();
  }
  document.documentElement.setAttribute("data-app", state.app);

  function buildTopbar() {
    var bar = document.getElementById("topbar");
    if (!bar) return;
    bar.className = "topbar";
    bar.innerHTML =
      '<button class="menu-btn" type="button" aria-label="Navigation öffnen">☰</button>' +
      '<a class="brand" href="' + (PKG ? PKG.launch : "index.html") + '"><span class="logo">▶</span><span>Lernpfad Präsentieren</span></a>' +
      '<span class="spacer"></span>' +
      '<span class="app-switch-label">Ich arbeite mit:</span>' +
      '<div class="app-switch" role="group" aria-label="Programm wählen">' +
      '<button type="button" data-app="ppt">PowerPoint 365</button>' +
      '<button type="button" data-app="oo">OnlyOffice</button>' +
      '<button type="button" data-app="both" title="Beide Anleitungen nebeneinander">beide</button>' +
      "</div>";
    bar.querySelector(".menu-btn").addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
    // Höhe der Kopfzeile messen (bricht am Handy um), damit die Navigation direkt darunter beginnt
    function measure() { document.documentElement.style.setProperty("--topbar-h", bar.offsetHeight + "px"); }
    measure();
    window.addEventListener("resize", measure);
    var btns = bar.querySelectorAll(".app-switch button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () { setApp(this.dataset.app); });
    }
    setApp(state.app);
  }

  // ---------- Navigation ----------
  function currentFile() {
    var f = location.pathname.split("/").pop();
    return f || "index.html";
  }

  function buildSidebar() {
    var nav = document.getElementById("sidebar");
    if (!nav) return;
    if (PKG) { renderPackageSidebar(nav); return; }
    var cur = currentFile();
    var html = PKG
      ? '<p class="pkg-hint">Die anderen Module findest du im Moodle-Kurs.</p>'
      : '<a href="index.html" class="btn secondary" style="display:block;text-align:center">Übersicht</a>';
    Object.keys(LEVELS).forEach(function (lv) {
      var mods = MODULES.filter(function (m) { return m.level === lv && inPackage(m.file); });
      if (!mods.length) return;
      var total = mods.reduce(function (s, m) { return s + m.min; }, 0);
      html += '<h4><span class="dot" style="background:' + LEVELS[lv].color + '"></span>' +
        LEVELS[lv].name + (PKG ? "" : ' <span style="font-weight:400;text-transform:none;letter-spacing:0">· ca. ' + Math.round(total / 45) + " Std.</span>") + "</h4><ul>";
      mods.forEach(function (m) {
        html += '<li><a href="' + m.file + '"' + (m.file === cur ? ' class="current" aria-current="page"' : "") + ">" +
          '<span class="tick">' + (state.done[m.id] ? "✓" : "") + "</span>" +
          "<span>" + (m.milestone ? "★ " : m.id.toUpperCase() + " · ") + esc(m.title) + "</span></a></li>";
      });
      html += "</ul>";
    });
    html += '<div class="extra"><ul>';
    EXTRA.forEach(function (x) {
      if (!inPackage(x.file)) return;
      html += '<li><a href="' + x.file + '"' + (x.file === cur ? ' class="current"' : "") + '><span class="tick"></span><span>' + esc(x.title) + "</span></a></li>";
    });
    html += "</ul></div>";
    nav.innerHTML = html;
  }

  function moduleById(id) {
    for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === id) return i;
    return -1;
  }

  function buildModuleHead(mod) {
    var main = document.querySelector("main");
    var head = el("div", { "class": "mod-head" });
    head.innerHTML =
      '<div class="badges"><span class="badge lv-' + mod.level + '">' + LEVELS[mod.level].name + "</span>" +
      '<span class="badge">' + (mod.milestone ? "Meilenstein" : "Modul " + mod.id.toUpperCase()) + "</span>" +
      '<span class="badge">⏱ ca. ' + mod.min + " Minuten</span></div>" +
      "<h1>" + esc(mod.title) + "</h1>";
    main.insertBefore(head, main.firstChild);
    document.title = mod.title + " – Lernpfad Präsentieren";
  }

  function buildFooter(mod) {
    var main = document.querySelector("main");
    var idx = moduleById(mod.id);

    // Notizfeld: Was nehme ich mit?
    var noteBox = el("div", { "class": "box note-box" });
    noteBox.innerHTML = '<label class="box-title" for="note-' + mod.id + '">💬 Deine Notiz</label>' +
      '<p style="margin:.2rem 0 .5rem;color:var(--muted);font-size:.92rem">Was nimmst du aus diesem Modul mit? Was war schwierig? Wo wirst du das brauchen – in der Schule, in der Ausbildung, in der Praxis?</p>';
    var ta = el("textarea", { id: "note-" + mod.id, rows: "3", placeholder: "Zum Beispiel: Ich wusste nicht, dass …" });
    ta.value = state.notes[mod.id] || "";
    ta.addEventListener("input", function () { state.notes[mod.id] = ta.value; save(); });
    noteBox.appendChild(ta);
    main.appendChild(noteBox);

    var wrap = el("div", { "class": "done-wrap" });
    var btn = el("button", { "class": "btn", type: "button" });
    function paint() {
      if (state.done[mod.id]) { btn.textContent = "✓ Erledigt – nochmal öffnen?"; btn.classList.add("is-done"); }
      else { btn.textContent = "Modul als erledigt markieren"; btn.classList.remove("is-done"); }
    }
    btn.addEventListener("click", function () {
      state.done[mod.id] = !state.done[mod.id];
      save(); paint(); buildSidebar();
      if (SC) {
        SC.setDone(!!state.done[mod.id], state.done[mod.id] ? 1 : checkProgress());
        // Moodle wertet den Abschluss beim Speichern aus – danach die Navigation neu holen (Sperren fallen weg)
        SC.flushNow();
        setTimeout(loadCourseNav, 1500);
      }
    });
    paint();
    wrap.appendChild(btn);
    wrap.appendChild(el("span", { style: "color:var(--muted);font-size:.9rem" },
      "Markiere das Modul erst, wenn du die Basis-Aufgaben und deine Checkliste geschafft hast." +
      (SC ? " Dein Stand wird in Moodle gespeichert." : "")));
    main.appendChild(wrap);

    if (PKG) {
      main.appendChild(el("div", { "class": "pager", id: "pkg-pager" }));
      renderPackagePager();
      return;
    }
    var pager = el("div", { "class": "pager" });
    var prev = MODULES[idx - 1], next = MODULES[idx + 1];
    pager.innerHTML =
      (prev ? '<a class="prev" href="' + prev.file + '"><small>← zurück</small>' + esc(prev.title) + "</a>" : '<a class="prev" href="index.html"><small>← zurück</small>Übersicht</a>') +
      (next ? '<a class="next" href="' + next.file + '"><small>weiter →</small>' + esc(next.title) + "</a>" : '<a class="next" href="index.html"><small>weiter →</small>Übersicht</a>');
    main.appendChild(pager);
  }

  // ---------- Menüpfade: "Einfügen › Bilder" ----------
  function buildPaths() {
    var paths = document.querySelectorAll(".path");
    for (var i = 0; i < paths.length; i++) {
      var p = paths[i];
      if (p.dataset.done) continue;
      var parts = p.textContent.split("›").map(function (s) { return s.trim(); });
      p.innerHTML = parts.map(function (s) { return '<span class="seg">' + esc(s) + "</span>"; }).join('<span class="sep">›</span>');
      p.dataset.done = "1";
    }
  }

  // ---------- Menüband-Schema ----------
  // <figure class="rb" data-app="ppt" data-tab="Einfügen"
  //   data-groups="Bilder: *1 Bilder | Illustrationen: Formen, SmartArt"
  //   data-menu="Bilder einfügen aus|*2 Dieses Gerät …|Stockbilder …"
  //   data-caption="..."></figure>
  function parseItem(s) {
    var m = /^\*(\d)?\s*(.*)$/.exec(s.trim());
    if (m) return { on: true, num: m[1] || "", text: m[2] };
    return { on: false, num: "", text: s.trim() };
  }
  function buildRibbons() {
    var figs = document.querySelectorAll("figure.rb");
    for (var i = 0; i < figs.length; i++) {
      var f = figs[i], app = f.dataset.app || "ppt", tab = f.dataset.tab || "";
      f.classList.add(app);
      var tabs = TABS[app].slice();
      var ctx = tabs.indexOf(tab) === -1 && tab;
      if (ctx) tabs.push(tab);
      var html = '<div class="ribbon ' + app + '" role="img" aria-label="Schema: ' + esc(APPNAME[app]) + ", Registerkarte " + esc(tab) + '">' +
        '<div class="rb-title">' + esc(APPNAME[app]) + (ctx ? " · Kontext-Registerkarte erscheint erst, wenn ein passendes Objekt markiert ist" : "") + "</div>" +
        '<div class="rb-tabs">' + tabs.map(function (t) {
          return '<span class="rb-tab' + (t === tab ? " on" : "") + '">' + esc(t) + "</span>";
        }).join("") + "</div>";
      if (f.dataset.groups) {
        html += '<div class="rb-body">';
        f.dataset.groups.split("|").forEach(function (g) {
          var idx = g.indexOf(":");
          var label = idx > -1 ? g.slice(0, idx).trim() : "";
          var items = (idx > -1 ? g.slice(idx + 1) : g).split(",");
          html += '<div class="rb-group"><div class="rb-btns">' + items.map(function (s) {
            var it = parseItem(s);
            return '<span class="rb-btn' + (it.on ? " on" : "") + '">' + esc(it.text) + (it.num ? '<span class="num">' + it.num + "</span>" : "") + "</span>";
          }).join("") + "</div>" + (label ? '<div class="rb-glabel">' + esc(label) + "</div>" : "") + "</div>";
        });
        html += "</div>";
      }
      if (f.dataset.menu) {
        var mi = f.dataset.menu.split("|");
        html += '<div class="rb-menu"><div class="rb-mhead">' + esc(mi.shift()) + "</div>" + mi.map(function (s) {
          var it = parseItem(s);
          return '<div class="it' + (it.on ? " on" : "") + '">' + (it.num ? "<b>" + it.num + ".</b> " : "") + esc(it.text) + "</div>";
        }).join("") + "</div>";
      }
      html += "</div>";
      if (f.dataset.caption) html += "<figcaption>Schema: " + esc(f.dataset.caption) + "</figcaption>";
      f.innerHTML = html;
    }

    // Seitenleiste / Aufgabenbereich:
    // <figure class="sp" data-app="oo" data-title="Folien-Einstellungen" data-rows="#Hintergrund|*Farbfüllung|Muster">
    var sps = document.querySelectorAll("figure.sp");
    for (var j = 0; j < sps.length; j++) {
      var s = sps[j], a = s.dataset.app || "oo";
      s.classList.add(a);
      var h = '<div class="sidepanel ' + a + '" role="img" aria-label="Schema: ' + esc(s.dataset.title || "") + '"><div class="sp-head">' + esc(s.dataset.title || "") + "</div>";
      (s.dataset.rows || "").split("|").forEach(function (r) {
        r = r.trim();
        if (r.charAt(0) === "#") h += '<div class="sp-row h">' + esc(r.slice(1)) + "</div>";
        else { var it = parseItem(r); h += '<div class="sp-row' + (it.on ? " on" : "") + '">' + (it.num ? "<b>" + it.num + ".</b> " : "") + esc(it.text) + "</div>"; }
      });
      h += "</div>";
      if (s.dataset.caption) h += "<figcaption>Schema: " + esc(s.dataset.caption) + "</figcaption>";
      s.innerHTML = h;
    }
  }

  // ---------- Screenshots ----------
  // <figure class="shot" data-src="img/screens/ppt-e1-oberflaeche.png" data-desc="..."></figure>
  // Solange die Datei fehlt, erscheint ein Platzhalter mit Dateiname und Beschreibung.
  function buildShots() {
    var shots = document.querySelectorAll("figure.shot");
    for (var i = 0; i < shots.length; i++) {
      (function (f) {
        var src = f.dataset.src, desc = f.dataset.desc || "";
        var img = new Image();
        img.alt = desc;
        img.onload = function () {
          f.innerHTML = "";
          var a = el("a", { href: src, target: "_blank", rel: "noopener", title: "Klicken zum Vergrößern" });
          a.appendChild(img);
          f.appendChild(a);
          f.appendChild(el("figcaption", null, esc(desc)));
        };
        img.onerror = function () {
          f.innerHTML = '<div class="placeholder">📷 <strong>Screenshot folgt:</strong> ' + esc(desc) +
            '<br><code>' + esc(src) + "</code></div>";
        };
        img.src = src;
      })(shots[i]);
    }
  }

  // ---------- Videos & Hilfeseiten ----------
  // <div class="media" data-ids="ms-bilder, oo-hilfe-bilder"></div>
  function mediaItem(id, m) {
    var ico = m.type === "video" ? "▶" : "?";
    var meta = [m.source, m.lang === "en" ? "englisch" : "deutsch"];
    if (m.duration) meta.push(m.duration);
    if (m.type === "hilfe") meta.push("Hilfeseite");
    if (m.type === "kurs") meta.push("Kurzkurs mit Videos");
    return '<a class="media-item ' + m.app + '" href="' + esc(m.url) + '" target="_blank" rel="noopener">' +
      '<span class="ico">' + ico + "</span><span><span class=\"t\">" + esc(m.title) + "</span><br>" +
      '<span class="meta">' + esc(APPNAME[m.app]) + " · " + esc(meta.join(" · ")) + "</span>" +
      (m.hint ? '<br><span class="meta">👉 ' + esc(m.hint) + "</span>" : "") + "</span></a>";
  }
  LP.mediaItem = mediaItem;
  function buildMedia() {
    var boxes = document.querySelectorAll("div.media[data-ids]");
    var reg = window.MEDIA || {};
    var cfg = window.MEDIA_CONFIG || {};
    for (var i = 0; i < boxes.length; i++) {
      var b = boxes[i], html = "";
      b.dataset.ids.split(",").forEach(function (id) {
        id = id.trim();
        var m = reg[id];
        if (!m) return;
        if (cfg.nurFreigegebene && !m.freigegeben) return;
        html += '<div class="' + m.app + '">' + mediaItem(id, m) + "</div>";
      });
      b.innerHTML = html || '<p class="meta" style="color:var(--muted)">Hier folgen geprüfte Videos.</p>';
    }
  }

  // ---------- Checklisten ----------
  function buildChecks(pageKey) {
    var lists = document.querySelectorAll("ul.check");
    var n = 0;
    for (var i = 0; i < lists.length; i++) {
      var lis = lists[i].children;
      for (var j = 0; j < lis.length; j++) {
        (function (li, id) {
          if (li.querySelector("input")) return;
          var key = pageKey + ":" + id;
          var cb = el("input", { type: "checkbox", id: "c-" + id });
          var lab = el("label", { "for": "c-" + id }, li.innerHTML);
          li.innerHTML = "";
          li.appendChild(cb); li.appendChild(lab);
          cb.checked = !!state.checks[key];
          li.classList.toggle("done", cb.checked);
          cb.addEventListener("change", function () {
            state.checks[key] = cb.checked;
            li.classList.toggle("done", cb.checked);
            save();
          });
        })(lis[j], n++);
      }
    }
  }

  // ---------- Kurz-Check (Quiz) ----------
  // <div class="qa" data-right="2"><p class="q">…</p><ol><li>…</li></ol><p class="fb" data-ok="…" data-no="…"></p></div>
  // Erster Versuch je Frage zählt (für Moodle: Antworten und Punkte)
  function quizScore(pageKey, total) {
    var raw = 0;
    for (var i = 0; i < total; i++) if (state.quiz[pageKey + ":q" + i] === true) raw++;
    return raw;
  }
  function buildQuiz(pageKey) {
    var qas = document.querySelectorAll(".qa");
    var letters = "abcdefghij";
    for (var i = 0; i < qas.length; i++) {
      (function (qa, qi) {
        var right = parseInt(qa.dataset.right, 10) - 1;
        var qkey = pageKey + ":q" + qi;
        var qtext = (qa.querySelector(".q") || qa).textContent.trim();
        var fb = qa.querySelector(".fb");
        var lis = qa.querySelectorAll("ol > li");
        for (var j = 0; j < lis.length; j++) {
          (function (li, idx) {
            var b = el("button", { type: "button" }, li.innerHTML);
            li.innerHTML = ""; li.appendChild(b);
            b.addEventListener("click", function () {
              var all = qa.querySelectorAll("button");
              for (var k = 0; k < all.length; k++) all[k].classList.remove("right", "wrong");
              if (state.quiz[qkey] == null) {
                state.quiz[qkey] = idx === right;
                save();
                if (SC) {
                  SC.answer(pageKey + "-frage-" + (qi + 1), qtext, letters.charAt(idx), letters.charAt(right), idx === right);
                  SC.score(quizScore(pageKey, qas.length), qas.length);
                }
              }
              if (idx === right) {
                b.classList.add("right");
                fb.innerHTML = "✅ " + (fb.dataset.ok || "Richtig!");
              } else {
                b.classList.add("wrong");
                fb.innerHTML = "❌ " + (fb.dataset.no || "Noch nicht – versuch es nochmal.");
              }
            });
          })(lis[j], j);
        }
      })(qas[i], i);
    }
  }

  function checkProgress() {
    var all = document.querySelectorAll("ul.check input[type=checkbox]");
    if (!all.length) return 0;
    var n = 0;
    for (var i = 0; i < all.length; i++) if (all[i].checked) n++;
    return n / all.length;
  }

  // ---------- Moodle-Paket: Navigation durch den ganzen Moodle-Kurs ----------
  // scorm.js holt den Kursaufbau aus Moodle (Abschnitte, Unterabschnitte, Aktivitäten, Häkchen, Sperren).
  // Die Seitenleiste zeigt den Kurs, unten gibt es Zurück/Weiter zur vorigen/nächsten Moodle-Aktivität –
  // auch zu Aufgaben (Upload), H5P und Tests. Ohne Moodle-Daten: nur „Zurück zum Kurs“.
  var NAV = PKG && window.LP_SCORM ? window.LP_SCORM : null;
  var navData = null;
  var ICON = { scorm: "📦", assign: "📤", h5pactivity: "🧩", quiz: "❓", page: "📄", book: "📘", url: "🔗",
    resource: "📎", forum: "💬", lesson: "🧭", glossary: "📚", feedback: "📝", choice: "✅" };

  function loadCourseNav() {
    if (!NAV) return;
    NAV.courseNav(function (data) {
      navData = data;
      buildSidebar();
      renderPackagePager();
    });
  }
  // Reihenfolge aller Aktivitäten; gesperrte Unterabschnitte/Abschnitte als Platzhalter (Inhalt kennt Moodle erst nach Freigabe)
  function flatNav() {
    var out = [];
    function walk(list) {
      list.forEach(function (it) {
        if (it.kind !== "sub") out.push(it);
        else if (it.locked) out.push({ kind: "cm", name: it.title, locked: true });
        else walk(it.items);
      });
    }
    (navData && navData.sections || []).forEach(function (sec) {
      if (sec.locked) out.push({ kind: "cm", name: sec.title, locked: true });
      else walk(sec.items);
    });
    return out;
  }
  function navDone(it) {
    var mid = document.body.dataset.module;
    return it.done || (it.current && mid && state.done[mid]);
  }
  function navItem(it) {
    if (it.kind === "sub") {
      if (it.locked) return '<li class="nav-sub locked"><span>🔒 ' + esc(it.title) + "</span></li>";
      return '<li class="nav-sub"><span class="nav-sub-title">' + esc(it.title) + "</span><ul>" + it.items.map(navItem).join("") + "</ul></li>";
    }
    var ico = ICON[it.module] || "•";
    var label = '<span class="tick">' + (navDone(it) ? "✓" : "") + '</span><span><span class="nav-ico" aria-hidden="true">' + ico + "</span> " + esc(it.name) + "</span>";
    if (it.current) return '<li><a class="current" aria-current="page" href="#">' + label + "</a></li>";
    if (it.locked || !it.url) return '<li><span class="nav-locked" title="Noch gesperrt">' + label.replace('<span class="tick"></span>', '<span class="tick">🔒</span>') + "</span></li>";
    return '<li><a href="' + esc(it.url) + '" data-go="1" title="' + esc(it.modname || "") + '">' + label + "</a></li>";
  }
  function renderPackageSidebar(nav) {
    var html = "";
    if (navData && navData.courseUrl) {
      html += '<a href="' + esc(navData.courseUrl) + '" data-go="1" class="btn secondary" style="display:block;text-align:center">← Zum Kurs</a>';
    } else {
      html += '<p class="pkg-hint">Die anderen Module findest du im Moodle-Kurs.</p>';
    }
    if (navData && navData.sections) {
      navData.sections.forEach(function (sec) {
        html += "<h4>" + (sec.locked ? "🔒 " : "") + esc(sec.title) + '</h4><ul class="course-nav">' + sec.items.map(navItem).join("") + "</ul>";
      });
    } else {
      var mod = MODULES[moduleById(document.body.dataset.module)];
      if (mod) html += '<ul><li><a class="current" aria-current="page" href="#"><span class="tick">' + (state.done[mod.id] ? "✓" : "") + "</span><span>" + esc(mod.title) + "</span></a></li></ul>";
    }
    html += '<div class="extra"><ul>';
    EXTRA.forEach(function (x) {
      if (!inPackage(x.file)) return;
      html += '<li><a href="' + x.file + '" target="_blank" rel="noopener"><span class="tick"></span><span>' + esc(x.title) + " ↗</span></a></li>";
    });
    nav.innerHTML = html + "</ul></div>";
  }
  function pagerLink(it, cls, label) {
    if (it.locked || !it.url) {
      var mid = document.body.dataset.module;
      return '<span class="' + cls + ' pkg-locked"><small>' + label + "</small>🔒 " + esc(it.name) +
        "<small>" + (mid && !state.done[mid] ? "Wird frei, wenn du dieses Modul als erledigt markierst." : "Noch gesperrt – schau im Kurs, was noch fehlt.") + "</small></span>";
    }
    return '<a class="' + cls + '" href="' + esc(it.url) + '" data-go="1"><small>' + label + "</small>" + (ICON[it.module] || "") + " " + esc(it.name) + "</a>";
  }
  function renderPackagePager() {
    var pager = document.getElementById("pkg-pager");
    if (!pager) return;
    var list = flatNav(), i = -1;
    for (var k = 0; k < list.length; k++) if (list[k].current) i = k;
    if (i < 0) {
      pager.innerHTML = navData && navData.courseUrl
        ? '<a class="next" href="' + esc(navData.courseUrl) + '" data-go="1"><small>weiter →</small>Zurück zum Moodle-Kurs</a>'
        : '<div class="box tip" style="flex:1"><div class="box-title">➡️ Wie geht’s weiter?</div><p>Geh zurück zum Moodle-Kurs. Dort findest du das nächste Modul.</p></div>';
    } else {
      var prev = null, next = list[i + 1] || null;
      for (var j = i - 1; j >= 0 && !prev; j--) if (list[j].url) prev = list[j];
      pager.innerHTML = (prev ? pagerLink(prev, "prev", "← zurück") : '<a class="prev" href="' + esc(navData.courseUrl) + '" data-go="1"><small>← zurück</small>Kursübersicht</a>') +
        (next ? pagerLink(next, "next", "weiter →") : '<a class="next" href="' + esc(navData.courseUrl) + '" data-go="1"><small>weiter →</small>Kursübersicht</a>');
      // Meilenstein: Knopf direkt zur nächsten Moodle-Aufgabe
      var ab = document.querySelector(".pkg-abgabe");
      for (var n = i + 1; ab && n < list.length; n++) {
        if (list[n].module === "assign") {
          ab.innerHTML = list[n].url
            ? '<a class="btn" href="' + esc(list[n].url) + '" data-go="1">📤 Zur Abgabe: ' + esc(list[n].name) + "</a>"
            : "🔒 " + esc(list[n].name) + " – wird frei, wenn du diese Seite als erledigt markierst.";
          break;
        }
      }
    }
  }
  // Links in die Moodle-Seite: ganzes Fenster wechseln und vorher speichern
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-go]");
    if (!a || !NAV) return;
    e.preventDefault();
    NAV.go(a.getAttribute("href"));
  });

  // Im Moodle-Paket: Links auf Seiten, die nicht im Paket sind, als Text zeigen;
  // Zusatzseiten (Spickzettel, Videos) im neuen Tab öffnen, damit das Modul offen bleibt.
  function fixPackageLinks() {
    if (!PKG) return;
    var links = document.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i], href = a.getAttribute("href");
      if (/^([a-z]+:|#|\/\/)/i.test(href)) continue;
      var file = href.split("#")[0].split("?")[0];
      if (!/\.html$/.test(file)) continue;
      if (!inPackage(file)) {
        var s = el("span", { "class": "pkg-link", title: "Findest du als eigenes Modul im Moodle-Kurs" }, a.innerHTML);
        a.parentNode.replaceChild(s, a);
      } else if (file !== PKG.launch) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      }
    }
  }

  // ---------- Fortschritt auf der Startseite ----------
  function buildProgress() {
    var bars = document.querySelectorAll("[data-progress]");
    for (var i = 0; i < bars.length; i++) {
      var lv = bars[i].dataset.progress;
      var mods = MODULES.filter(function (m) { return m.level === lv; });
      var done = mods.filter(function (m) { return state.done[m.id]; }).length;
      bars[i].innerHTML = '<div class="progress"><span style="width:' + Math.round(done / mods.length * 100) + '%"></span></div>' +
        '<div class="progress-label">' + done + " von " + mods.length + " erledigt</div>";
    }
    var lists = document.querySelectorAll("[data-modlist]");
    for (var k = 0; k < lists.length; k++) {
      var l = lists[k].dataset.modlist;
      lists[k].innerHTML = MODULES.filter(function (m) { return m.level === l; }).map(function (m) {
        return '<li><a href="' + m.file + '">' + (state.done[m.id] ? "✓ " : "") + esc(m.title) + "</a> <span style=\"color:var(--muted)\">(" + m.min + " min)</span></li>";
      }).join("");
    }
    var reset = document.getElementById("reset-progress");
    if (reset) reset.addEventListener("click", function () {
      if (confirm("Wirklich den gesamten Fortschritt (Häkchen, Notizen, erledigte Module) in diesem Browser löschen?")) {
        state.done = {}; state.checks = {}; state.notes = {}; state.selfcheck = {}; save(); location.reload();
      }
    });

    // Alle Notizen als Text kopieren (z. B. zum Abgeben)
    var copyBtn = document.getElementById("copy-notes");
    if (copyBtn) copyBtn.addEventListener("click", function () {
      var txt = MODULES.filter(function (m) { return (state.notes[m.id] || "").trim(); }).map(function (m) {
        return m.id.toUpperCase() + " – " + m.title + "\n" + state.notes[m.id].trim();
      }).join("\n\n");
      var msg = document.getElementById("copy-notes-msg");
      if (!txt) { msg.textContent = "Noch keine Notizen vorhanden."; return; }
      var done = function () { msg.textContent = "Kopiert – du kannst die Notizen jetzt z. B. in ein Dokument einfügen."; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, function () { fallbackCopy(txt); done(); });
      } else { fallbackCopy(txt); done(); }
    });
  }
  function fallbackCopy(txt) {
    var t = el("textarea"); t.value = txt; document.body.appendChild(t); t.select();
    try { document.execCommand("copy"); } catch (e) { /* ignorieren */ }
    document.body.removeChild(t);
  }

  // ---------- Abgabe-Kasten auf den Meilenstein-Seiten ----------
  // <div class="abgabe" data-option="Einsteiger: „Meilenstein: …“"></div>
  function buildAbgabe() {
    var boxes = document.querySelectorAll("div.abgabe");
    for (var i = 0; i < boxes.length; i++) {
      var option = boxes[i].dataset.option || "";
      if (PKG) {
        boxes[i].innerHTML = '<p style="margin:0">Gib deine Dateien in der <strong>Moodle-Aufgabe</strong> ab, die im Kurs direkt unter diesem Meilenstein steht. Dort findest du auch das Bewertungsraster und später das Feedback deiner Lehrkraft.</p><p class="pkg-abgabe" style="margin:.6rem 0 0"></p>';
        continue;
      }
      boxes[i].innerHTML = ABGABE_LINK
        ? '<p style="margin:0 0 .5rem"><a class="btn" href="' + esc(ABGABE_LINK) + '" target="_blank" rel="noopener">Zum Abgabeformular ↗</a></p>' +
          '<p style="margin:0;font-size:.92rem">Melde dich mit deinem Schul-Konto an, lade deine Datei(en) hoch und wähle bei „Der abgegebene Meilenstein ist“: <strong>' + esc(option) + "</strong>.</p>"
        : '<p style="margin:0">Den Link zum Abgabeformular bekommst du von deiner Lehrkraft.</p>';
    }
  }

  // ---------- Selbstcheck auf der Startseite ----------
  // <div id="selfcheck"> mit Radiogruppen name="q1".."q3" (Werte 0–2) und <p id="suggest">
  function buildSelfcheck() {
    var box = document.getElementById("selfcheck");
    if (!box) return;
    var qs = ["q1", "q2", "q3"];
    function evaluate() {
      var sum = 0, n = 0;
      qs.forEach(function (q) { if (state.selfcheck[q] != null) { sum += +state.selfcheck[q]; n++; } });
      if (n < 3) return;
      var lv = sum <= 1 ? "einsteiger" : sum <= 4 ? "fortgeschrittene" : "profis";
      var hint = {
        einsteiger: "Starte mit E1 – auch wenn dir manches bekannt vorkommt, lohnen sich die Gestaltungstipps.",
        fortgeschrittene: "Prüf dich zuerst mit der Checkliste im <a href=\"em-meilenstein.html\">Einsteiger-Meilenstein</a>. Klappt alles? Dann steig bei F1 ein. Sonst hol die fehlenden Module nach.",
        profis: "Prüf dich mit den Checklisten der Meilensteine <a href=\"em-meilenstein.html\">Einsteiger</a> und <a href=\"fm-meilenstein.html\">Fortgeschrittene</a>. Sitzt alles? Dann los mit P1."
      }[lv];
      document.getElementById("suggest").innerHTML = "Mein Vorschlag: <b>" + LEVELS[lv].name + "</b> → <a href=\"" + LEVELS[lv].start + "\">zum Start</a>. " + hint +
        " <br><small>Absprache mit deiner Lehrkraft geht vor – sie weiß, womit eure Klasse arbeitet.</small>";
    }
    qs.forEach(function (q) {
      var radios = box.querySelectorAll('input[name="' + q + '"]');
      for (var i = 0; i < radios.length; i++) {
        if (state.selfcheck[q] === radios[i].value) radios[i].checked = true;
        radios[i].addEventListener("change", function () { state.selfcheck[this.name] = this.value; save(); evaluate(); });
      }
    });
    evaluate();
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildTopbar();
    buildSidebar();
    var id = document.body.dataset.module;
    var idx = id ? moduleById(id) : -1;
    if (idx > -1) { buildModuleHead(MODULES[idx]); buildFooter(MODULES[idx]); }
    buildPaths();
    buildRibbons();
    buildShots();
    buildMedia();
    buildChecks(id || currentFile());
    buildQuiz(id || currentFile());
    buildProgress();
    buildSelfcheck();
    buildAbgabe();
    fixPackageLinks();
    loadCourseNav();
    if (SC) {
      var cbs = document.querySelectorAll("ul.check input[type=checkbox]");
      for (var c = 0; c < cbs.length; c++) cbs[c].addEventListener("change", function () {
        if (id) SC.setDone(!!state.done[id], state.done[id] ? 1 : checkProgress());
      });
    }
  });
})();
