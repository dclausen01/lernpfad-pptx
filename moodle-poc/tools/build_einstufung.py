#!/usr/bin/env python3
"""Baut Einstufungstests aus den Kurz-Checks einer Stufe.

Wer den Test „direkt zu Fortgeschrittene“ besteht, hat gezeigt, dass er die Einsteiger-Inhalte kann – deshalb
stammen die Fragen aus den Kurz-Checks (<div class="qa">) der Einsteiger-Module. In Moodle schaltet ein bestandener
Test (Bewertung ≥ Bestehensgrenze) die nächste Stufe frei; das regelt die Kursbeschreibung (freischalten_nach).

Aufruf (im Wurzelordner des Lernpfads):
    python3 moodle-poc/tools/build_einstufung.py
Ergebnis: einstufung-fortgeschrittene.html, einstufung-profis.html
"""
import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BESTEHEN = 80  # Prozent

# Test → (Stufe, die er freischaltet; Stufe, aus deren Modulen die Fragen kommen)
TESTS = [
    ("einstufung-fortgeschrittene.html", "Fortgeschrittene", "einsteiger", "🚀"),
    ("einstufung-profis.html", "Profis", "fortgeschrittene", "🏆"),
]


def module():
    js = (ROOT / "assets/js/app.js").read_text(encoding="utf-8")
    return [dict(id=m[0], level=m[1], file=m[2], title=m[3]) for m in
            re.findall(r'\{ id: "(\w+)", level: "(\w+)", file: "([^"]+)", title: "([^"]+)"', js)]


def fragen(datei):
    text = (ROOT / datei).read_text(encoding="utf-8")
    return re.findall(r'(<div class="qa" data-right="\d+">.*?</div>)', text, re.S)


SEITE = """<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Einstufungstest: direkt zu {stufe} – Lernpfad Präsentieren</title>
<link rel="stylesheet" href="assets/css/style.css">
<script src="assets/js/videos.js" defer></script>
<script src="assets/js/app.js" defer></script>
</head>
<!-- Erzeugt von moodle-poc/tools/build_einstufung.py aus den Kurz-Checks der Module {quellen}. Nicht von Hand ändern. -->
<body data-page="test" data-bestehen="{bestehen}" data-stufe="{stufe}">
<header id="topbar"></header>
<div class="layout wide">
<main>

<section class="hero">
<div class="badges"><span class="badge">Einstufungstest</span><span class="badge">{anzahl} Fragen</span><span class="badge">bestanden ab {bestehen} %</span></div>
<h1>{icon} Direkt zu {stufe}?</h1>
<p class="lead">Du kannst schon einiges? Dann zeig es hier. Wenn du bestehst, wird die Stufe <strong>{stufe}</strong> für dich freigeschaltet – ohne dass du alle Module davor durcharbeiten musst.</p>
</section>

<div class="box note">
<div class="box-title">👉 So geht’s</div>
<ul>
<li>Beantworte alle {anzahl} Fragen und klicke dann auf <strong>„Auswerten“</strong>.</li>
<li>Du brauchst mindestens <strong>{bestehen} %</strong> richtige Antworten.</li>
<li>Nicht bestanden? Kein Problem: Arbeite die Module durch oder versuche es später noch einmal. Es zählt dein bestes Ergebnis.</li>
</ul>
</div>

<div id="test-best" aria-live="polite"></div>

<form id="test" class="box quiz">
{fragen}
<p style="margin:1.2rem 0 0"><button class="btn" type="submit">Auswerten</button></p>
</form>

<div id="test-result" aria-live="polite"></div>

</main>
</div>
</body>
</html>
"""


def main():
    mods = module()
    for datei, stufe, quelle, icon in TESTS:
        teile, quellen = [], []
        for m in [m for m in mods if m["level"] == quelle]:
            qs = fragen(m["file"])
            if qs:
                quellen.append(m["id"].upper())
            for q in qs:
                # als Testfrage kennzeichnen (Auswertung erst am Ende), Herkunft merken
                teile.append(q.replace('<div class="qa"', f'<div class="tq" data-quelle="{m["id"].upper()} · {html.escape(m["title"])}"', 1))
        text = SEITE.format(stufe=stufe, icon=icon, bestehen=BESTEHEN, anzahl=len(teile),
                            quellen=", ".join(quellen), fragen="\n".join(teile))
        (ROOT / datei).write_text(text, encoding="utf-8")
        print(f"{datei}: {len(teile)} Fragen aus {', '.join(quellen)}")


if __name__ == "__main__":
    main()
