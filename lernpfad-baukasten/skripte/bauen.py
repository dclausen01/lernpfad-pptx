#!/usr/bin/env python3
"""Baut aus dem Lernpfad-Ordner die Web-Version (ausgabe/web/).

Die Web-Version ist zugleich die Grundlage der Lernpakete für Moodle (lernpakete.py). Sie läuft offline,
auf jedem Webserver und ohne externe Dienste.

    python3 bauen.py [ordner]

Entwürfe (review: entwurf/geprueft) werden mitgebaut und mit einem Hinweis markiert – so kann die Lehrkraft sie
im Browser sichten. In Moodle landen nur freigegebene Module (siehe lernpakete.py).
"""
import html
import json
import shutil
import sys

from bausteine import Uebersetzer, esc
from gemeinsam import VORLAGE, Fehler, Kurs, kurs_aus_argumenten, melde_fehler_und_ende, slug

NIVEAU_BADGE = {"entwurf": "Entwurf", "geprueft": "geprüft – noch nicht freigegeben"}


def seite(kurs, titel, inhalt, body_attr="", breit=False, sidebar=True):
    """Gerüst einer Seite – wie in allen bisherigen Lernpfaden."""
    return f"""<!doctype html>
<html lang="{esc(kurs.k.get('sprache', 'de'))}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(titel)} – {esc(kurs.titel)}</title>
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="assets/css/kurs.css">
<script src="assets/js/kurs.js"></script>
<script src="assets/js/medien.js" defer></script>
<script src="assets/js/app.js" defer></script>
</head>
<body{body_attr}>
<header id="topbar"></header>
<div class="layout{' wide' if breit else ''}">
{'<nav id="sidebar" aria-label="Lernpfad"></nav>' if sidebar and not breit else ''}
<main>
{inhalt}
</main>
</div>
{f'<footer class="site">{kurs.k.get("fusszeile")}</footer>' if kurs.k.get("fusszeile") else ''}
</body>
</html>
"""


class Bauer:
    def __init__(self, kurs):
        self.kurs = kurs
        k = kurs.k
        self.var = k.get("varianten") or None
        self.u = Uebersetzer((self.var or {}).get("optionen", {}),
                             {mid: m["datei"] for mid, m in kurs.module.items()})
        self.web = kurs.ausgabe / "web"
        self.seiten = []  # für site.json

    # ---------- Bausteine aus dem Modulkopf
    def ziele(self, m):
        if not m.get("lernziele"):
            return ""
        return ('<div class="box goals"><div class="box-title">🎯 Das kannst du nach diesem Modul</div><ul>' +
                "".join(f"<li>{self.u.inline(z)}</li>" for z in m["lernziele"]) + "</ul></div>")

    def kurzcheck(self, m, klasse="qa"):
        fragen = m.get("kurzcheck") or []
        if not fragen:
            return ""
        teile = []
        for f in fragen:
            ant = "".join(f"<li>{self.u.inline(a)}</li>" for a in f["antworten"])
            quelle = f' data-quelle="{esc(m["id"].upper() + " · " + m["titel"])}"' if klasse == "tq" else ""
            teile.append(f'<div class="{klasse}" data-right="{int(f["richtig"])}"{quelle}><p class="q">{self.u.inline(f["frage"])}</p>'
                         f'<ol>{ant}</ol><p class="fb" data-ok="{esc(f.get("richtig_text", "Richtig!"))}" '
                         f'data-no="{esc(f.get("falsch_text", "Noch nicht – versuch es nochmal."))}"></p></div>')
        if klasse == "tq":
            return "\n".join(teile)
        return '<div class="box quiz"><div class="box-title">🧠 Kurz-Check</div>' + "".join(teile) + "</div>"

    def abgabe(self, m):
        a = m.get("abgabe")
        if not a:
            return ""
        text = self.u.block(a.get("text", ""))
        return ('<h2>Abgabe</h2><div class="box download"><div class="box-title">📤 ' + esc(a.get("titel", "Abgabe")) +
                "</div>" + text + f'<div class="abgabe" data-option="{esc(a.get("option", m["titel"]))}"></div></div>')

    def raster(self, m):
        r = m.get("raster")
        if not r:
            return ""
        zeilen = "".join(f"<tr><td>{self.u.inline(z['kriterium'])}</td><td>{self.u.inline(z.get('erreicht', ''))}</td>"
                         f"<td>{self.u.inline(z.get('besonders_gut', '—'))}</td></tr>" for z in r)
        return ('<h2>So schaut deine Lehrkraft drauf</h2><p>Damit du weißt, worauf es ankommt – das ist das Bewertungsraster:</p>'
                '<div class="table-wrap"><table><tr><th>Kriterium</th><th>✔ erreicht</th><th>★ besonders gut</th></tr>' +
                zeilen + "</table></div>")

    def medien(self, m):
        ids = m.get("medien") or []
        if not ids:
            return ""
        return f'<h2>Videos & Hilfe</h2><div class="media" data-ids="{esc(", ".join(ids))}"></div>'

    # ---------- Seiten
    def modulseite(self, m):
        body = self.u.block(m["text"])
        einsetzen = {"kurzcheck": self.kurzcheck(m), "abgabe": self.abgabe(m), "raster": self.raster(m),
                     "medien": self.medien(m)}
        rest = []
        for name in ("abgabe", "raster", "kurzcheck", "medien"):
            platz = f'<div data-lp="{name}"></div>'
            if platz in body:
                body = body.replace(platz, einsetzen[name])
            elif einsetzen[name]:
                rest.append(einsetzen[name])
        entwurf = ""
        if m.get("review") != "freigegeben":
            entwurf = (f'<div class="box warn"><strong>{NIVEAU_BADGE.get(m.get("review"), "Entwurf")}</strong> – '
                       "dieses Modul ist noch nicht von der Lehrkraft freigegeben.</div>")
        inhalt = entwurf + self.ziele(m) + body + "".join(rest)
        self.schreibe(m["datei"], seite(self.kurs, m["titel"], inhalt, f' data-module="{esc(m["id"])}"'),
                      art="modul", id=m["id"], titel=m["titel"], review=m.get("review"))

    def zusatzseite(self, s):
        inhalt = f"<h1>{esc(s['titel'])}</h1>" + self.u.block(s["text"])
        self.schreibe(s["datei"], seite(self.kurs, s["titel"], inhalt), art="seite", titel=s["titel"])

    def selbstcheck_html(self):
        sc = self.kurs.k.get("selbstcheck")
        if not sc:
            return ""
        teile = []
        for i, f in enumerate(sc["fragen"], 1):
            opts = "".join(f'<label><input type="radio" name="q{i}" value="{j}">{esc(a)}</label>'
                           for j, a in enumerate(f["antworten"]))
            teile.append(f'<div class="scq"><p>{esc(f["frage"])}</p><div class="opts">{opts}</div></div>')
        return ('<h2>Wo steigst du ein? – Selbstcheck</h2><div class="box selfcheck" id="selfcheck">' + "".join(teile) +
                '<p id="suggest" aria-live="polite">Beantworte die Fragen, dann bekommst du einen Vorschlag.</p></div>')

    def hero(self):
        k = self.kurs.k
        logo = f'<img class="logo-bbz" src="{esc(k["logo"])}" alt="Logo">' if k.get("logo") else ""
        badges = "".join(f'<span class="badge">{esc(b)}</span>' for b in k.get("badges", []))
        return (f'<section class="hero">{logo}<div class="badges">{badges}</div><h1>{esc(k.get("ueberschrift", self.kurs.titel))}</h1>'
                f'<p class="lead">{self.u.inline(k.get("untertitel", ""))}</p></section>')

    def griffbereit(self):
        if not self.kurs.seiten and not self.kurs.medien:
            return ""
        karten = "".join(f'<a class="level-card" href="{esc(s["datei"])}" style="text-decoration:none;color:inherit">'
                         f'<h3 style="margin-top:0">{esc(s.get("icon", "📄"))} {esc(s["titel"])}</h3><p>{self.u.inline(s.get("beschreibung", ""))}</p></a>'
                         for s in self.kurs.seiten if not s.get("nur_web_lehrkraft_ausblenden"))
        if self.kurs.medien:
            karten += ('<a class="level-card" href="videos.html" style="text-decoration:none;color:inherit"><h3 style="margin-top:0">'
                       '🎬 Videos & Hilfeseiten</h3><p>Alle geprüften Anleitungen an einem Ort.</p></a>')
        return f'<h2>Immer griffbereit</h2><div class="levels">{karten}</div>'

    def startseite_web(self):
        k = self.kurs.k
        karten = []
        for st in self.kurs.stufen:
            mods = self.kurs.module_der_stufe(st["id"])
            karten.append(f'<div class="level-card {esc(st["id"])}"><h2>{esc(st.get("icon", ""))} {esc(st["name"])}</h2>'
                          f'<p>{self.u.inline(st.get("text", ""))}</p><div data-progress="{esc(st["id"])}"></div>'
                          f'<ul data-modlist="{esc(st["id"])}"></ul><a class="btn" href="{esc(mods[0]["datei"])}">Starten</a></div>')
        einleitung = self.u.block(k.get("einleitung", ""))
        notizen = ('<h2>Deine Notizen</h2><p>In jedem Modul kannst du unten notieren, was du mitnimmst. Hier kopierst du alle Notizen auf einmal.</p>'
                   '<p><button class="btn" id="copy-notes" type="button">Alle Notizen kopieren</button> '
                   '<span id="copy-notes-msg" style="color:var(--ok);font-weight:600"></span></p>'
                   '<p style="margin-top:2rem"><button class="btn secondary" id="reset-progress" type="button">'
                   "Meinen Fortschritt in diesem Browser zurücksetzen</button></p>")
        inhalt = (self.hero() + einleitung + self.selbstcheck_html() + f'<div class="levels">{"".join(karten)}</div>' +
                  self.griffbereit() + notizen)
        self.schreibe("index.html", seite(self.kurs, "Übersicht", inhalt, breit=True), art="index", titel="Übersicht")

    def startseite_moodle(self):
        """„Mein Lernpfad“ – nur im Moodle-Kurs; füllt sich mit dem Kursaufbau aus Moodle."""
        inhalt = (self.hero().replace(f"<h1>{esc(self.kurs.k.get('ueberschrift', self.kurs.titel))}</h1>", "<h1>Mein Lernpfad</h1>") +
                  '<div class="box continue-box" id="pkg-continue" aria-live="polite"><p>Dein Lernpfad wird geladen …</p></div>'
                  '<div class="levels" id="pkg-levels"></div><div id="pkg-einstufung"></div>' + self.selbstcheck_html() +
                  '<div class="box note"><div class="box-title">👉 So funktioniert’s</div><ol>' +
                  ("<li>Stell oben ein, womit du arbeitest. Das gilt dann für alle Module.</li>" if self.var else "") +
                  "<li>Arbeite die Module der Reihe nach durch. Am Ende jedes Moduls: <strong>„Modul als erledigt markieren“</strong>.</li>"
                  "<li>Am Ende jeder Stufe gibst du einen <strong>★ Meilenstein</strong> in Moodle ab.</li>" +
                  ("<li>Kannst du schon viel? Mit einem <strong>🎯 Einstufungstest</strong> springst du direkt in die nächste Stufe.</li>"
                   if self.kurs.einstufung_aktiv() else "") + "</ol></div>" + self.griffbereit())
        self.schreibe("start.html", seite(self.kurs, "Mein Lernpfad", inhalt, ' data-page="start"', breit=True),
                      art="start", titel="🧭 Mein Lernpfad – hier geht's los")

    def einstufungstests(self):
        if not self.kurs.einstufung_aktiv():
            return
        grenze = int(self.kurs.k.get("einstufung", {}).get("bestehen", 80))
        stufen = self.kurs.stufen
        for i in range(1, len(stufen)):
            ziel, vorher = stufen[i], stufen[i - 1]
            fragen = "\n".join(self.kurzcheck(m, "tq") for m in self.kurs.module_der_stufe(vorher["id"]))
            anzahl = fragen.count('class="tq"')
            if not anzahl:
                print(f"  Hinweis: kein Einstufungstest für {ziel['name']} – in Stufe {vorher['name']} gibt es keine Kurz-Checks.")
                continue
            inhalt = f"""<section class="hero"><div class="badges"><span class="badge">Einstufungstest</span><span class="badge">{anzahl} Fragen</span><span class="badge">bestanden ab {grenze} %</span></div>
<h1>🎯 Direkt zu {esc(ziel['name'])}?</h1>
<p class="lead">Du kannst schon einiges? Dann zeig es hier. Wenn du bestehst, wird die Stufe <strong>{esc(ziel['name'])}</strong> für dich freigeschaltet – ohne dass du alle Module davor durcharbeiten musst.</p></section>
<div class="box note"><div class="box-title">👉 So geht’s</div><ul><li>Beantworte alle {anzahl} Fragen und klicke dann auf <strong>„Auswerten“</strong>.</li>
<li>Du brauchst mindestens <strong>{grenze} %</strong> richtige Antworten.</li><li>Nicht bestanden? Kein Problem: Arbeite die Module durch oder versuche es später noch einmal. Es zählt dein bestes Ergebnis.</li></ul></div>
<div id="test-best" aria-live="polite"></div>
<form id="test" class="box quiz">{fragen}<p style="margin:1.2rem 0 0"><button class="btn" type="submit">Auswerten</button></p></form>
<div id="test-result" aria-live="polite"></div>"""
            datei = self.kurs.einstufung_datei(ziel["id"])
            self.schreibe(datei, seite(self.kurs, f"Einstufungstest: direkt zu {ziel['name']}", inhalt,
                                       f' data-page="test" data-bestehen="{grenze}" data-stufe="{esc(ziel["name"])}"', breit=True),
                          art="einstufung", titel=f"🎯 Einstufungstest: direkt zu {ziel['name']}", stufe=ziel["id"], bestehen=grenze)

    def videoseite(self):
        if not self.kurs.medien:
            return
        inhalt = ("<h1>Videos & Hilfeseiten</h1><p>Alle Anleitungen aus den Modulen an einem Ort. Es werden nur offizielle Quellen verlinkt.</p>"
                  f'<div class="media" data-ids="{esc(", ".join(self.kurs.medien))}"></div>')
        self.schreibe("videos.html", seite(self.kurs, "Videos & Hilfeseiten", inhalt), art="seite", titel="Videos & Hilfeseiten")

    # ---------- Konfiguration für app.js, Farben, Medien
    def kurs_js(self):
        k = self.kurs.k
        extras = [{"file": s["datei"], "title": s["titel"]} for s in self.kurs.seiten]
        if self.kurs.medien:
            extras.append({"file": "videos.html", "title": "Videos & Hilfeseiten"})
        sc = k.get("selbstcheck")
        cfg = {
            "titel": self.kurs.titel, "kurzname": self.kurs.kurzname, "logoZeichen": k.get("logo_zeichen", "▶"),
            "stufen": [{"id": s["id"], "name": s["name"], "icon": s.get("icon", ""),
                        "start": self.kurs.module[s["module"][0]]["datei"]} for s in self.kurs.stufen],
            "module": [{"id": m["id"], "level": m["stufe"], "file": m["datei"], "title": m["titel"],
                        "min": m.get("minuten", 0), "milestone": bool(m.get("meilenstein"))}
                       for m in (self.kurs.module[i] for i in self.kurs.reihenfolge)],
            "abgabeLink": k.get("abgabe_link", ""),
            "extras": extras,
            "varianten": self.var,
            "menueband": k.get("menueband") or {},
            "selbstcheck": {"fragen": len(sc["fragen"]), "empfehlung": sc.get("empfehlung", [])} if sc else None,
            "einstufung": {s["id"]: self.kurs.einstufung_datei(s["id"]) for s in self.kurs.stufen[1:]} if self.kurs.einstufung_aktiv() else {},
        }
        (self.web / "assets/js/kurs.js").write_text(
            "/* Erzeugt von bauen.py aus kurs.yaml – nicht von Hand ändern. */\nwindow.LP_KURS = " +
            json.dumps(cfg, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")

    def kurs_css(self):
        z = ["/* Erzeugt von bauen.py: Farben der Stufen und Varianten dieses Kurses. */", ":root {"]
        for i, st in enumerate(self.kurs.stufen, 1):
            n = (i - 1) % 5 + 1
            z.append(f"  --lv-{st['id']}: var(--lv-{n}); --lv-{st['id']}-soft: var(--lv-{n}-soft);")
        z.append("}")
        for st in self.kurs.stufen:
            s = st["id"]
            z.append(f".badge.lv-{s} {{ background: var(--lv-{s}-soft); color: var(--deep); box-shadow: inset 3px 0 0 var(--lv-{s}); }}")
            z.append(f".level-card.{s} {{ border-top-color: var(--lv-{s}); }}")
        ids = list((self.var or {}).get("optionen", {}))
        for j, v in enumerate(ids, 1):
            c = f"var(--v-{(j - 1) % 3 + 1})"
            z += [f".how.{v} {{ border-top-color: {c}; }}", f".how.{v} .app-label {{ background: {c}; }}",
                  f".ribbon.{v} .rb-title, .sidepanel.{v} .sp-head, .media-item.{v} .ico {{ background: {c}; }}",
                  f"span.{v} {{ font-weight: 600; }}"]
            for w in ids:
                if w != v:
                    z.append(f'html[data-app="{v}"] .{w}:not(.keep) {{ display: none !important; }}')
        (self.web / "assets/css/kurs.css").write_text("\n".join(z) + "\n", encoding="utf-8")

    def medien_js(self):
        (self.web / "assets/js/medien.js").write_text(
            "/* Erzeugt von bauen.py aus medien.yaml – nicht von Hand ändern. */\nwindow.MEDIA_CONFIG = " +
            json.dumps({"nurFreigegebene": bool(self.kurs.k.get("nur_freigegebene_medien"))}) + ";\nwindow.MEDIA = " +
            json.dumps(self.kurs.medien, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")

    # ---------- Ablauf
    def schreibe(self, datei, inhalt, **info):
        (self.web / datei).write_text(inhalt, encoding="utf-8")
        self.seiten.append(dict(datei=datei, **info))

    def baue(self):
        if self.web.exists():
            shutil.rmtree(self.web)
        shutil.copytree(VORLAGE / "assets", self.web / "assets")
        if (self.kurs.ordner / "material").exists():
            shutil.copytree(self.kurs.ordner / "material", self.web / "material")
        self.kurs_js()
        self.kurs_css()
        self.medien_js()
        for mid in self.kurs.reihenfolge:
            self.modulseite(self.kurs.module[mid])
        for s in self.kurs.seiten:
            self.zusatzseite(s)
        self.videoseite()
        self.startseite_web()
        self.startseite_moodle()
        self.einstufungstests()
        (self.web / "site.json").write_text(json.dumps({"titel": self.kurs.titel, "kurzname": self.kurs.kurzname,
                                                         "seiten": self.seiten}, ensure_ascii=False, indent=1), encoding="utf-8")
        (self.web / ".nojekyll").write_text("")
        return self.web


def main(argv=None):
    ap = kurs_aus_argumenten(argv, __doc__)
    args = ap.parse_args(argv)
    from pruefen import pruefe
    try:
        ok, _ = pruefe(args.ordner, still=True)
        if not ok:
            raise Fehler("Erst die Fehler oben beheben (Details: pruefen.py).")
        kurs = Kurs(args.ordner)
        web = Bauer(kurs).baue()
    except Fehler as e:
        melde_fehler_und_ende(e)
    n = len(kurs.reihenfolge)
    entwuerfe = sum(1 for m in kurs.module.values() if m.get("review") != "freigegeben")
    print(f"✓ Web-Version gebaut: {web}  ({n} Module, davon {entwuerfe} noch nicht freigegeben)")
    print(f"  Ansehen: {web / 'index.html'} im Browser öffnen")


if __name__ == "__main__":
    main()
