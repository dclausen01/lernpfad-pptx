#!/usr/bin/env python3
"""Erzeugt H5P-Pakete für Moodle aus den Inhalten der Lernpfade.

1. Kurz-Checks des Lernpfads Präsentieren (<div class="qa"> in den Modulseiten) → H5P „Question Set“
   mit Multiple-Choice-Fragen und dem Feedback aus data-ok / data-no.
2. Lückentexte im LF11c-Schema (typ: lueckentext) → H5P „Fill in the Blanks“.

Die Pakete enthalten die offiziellen H5P-Bibliotheken (vom H5P-Hub, einmal in moodle-poc/.cache/ geladen).
Damit laufen sie auch in einem Moodle, in dem die Inhaltstypen noch nicht installiert sind – allerdings darf
dann nur jemand mit dem Recht „H5P-Bibliotheken aktualisieren“ (Admin/Manager) das erste Paket hochladen.
Alle Knopf- und Rückmeldetexte kommen aus den deutschen Sprachdateien der Bibliotheken.

Aufruf (im Wurzelordner des Lernpfads Präsentieren):
    python3 moodle-poc/tools/build_h5p.py kurzcheck e1 e2 e3
    python3 moodle-poc/tools/build_h5p.py lueckentext /pfad/zu/lernpfad-lf11c m1-a14
"""
import html
import json
import re
import sys
import urllib.request
import uuid
import zipfile
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / "moodle-poc" / ".cache" / "h5p"
OUT = ROOT / "moodle-poc" / "dist" / "h5p"
HUB = "https://api.h5p.org/v1/content-types/"
LANG = "de"
# Hub-Pakete, aus denen die Bibliotheken stammen (enthalten alle benötigten Abhängigkeiten)
HUB_PAKETE = ["H5P.QuestionSet"]


# ---------------------------------------------------------------- Bibliotheken

def hub_paket(name):
    CACHE.mkdir(parents=True, exist_ok=True)
    p = CACHE / f"{name}.h5p"
    if not p.exists():
        print(f"lade {name} vom H5P-Hub …", file=sys.stderr)
        urllib.request.urlretrieve(HUB + name, p)
    return p


class Bibliotheken:
    """Alle Bibliotheksordner aus den Hub-Paketen (Name-Major.Minor → Zip + Dateiliste)."""

    def __init__(self, pakete):
        self.orte = {}
        for name in pakete:
            z = zipfile.ZipFile(hub_paket(name))
            for n in z.namelist():
                top = n.split("/")[0]
                if "/" in n and top not in ("content",) and top not in self.orte:
                    self.orte[top] = z

    def json(self, lib, datei):
        z = self.orte[lib]
        try:
            return json.loads(z.read(f"{lib}/{datei}"))
        except KeyError:
            return None

    def abhaengigkeiten(self, lib, mit_editor=True):
        """lib und alle (rekursiven) Abhängigkeiten, als Ordnernamen."""
        gesehen, offen = [], [lib]
        while offen:
            cur = offen.pop()
            if cur in gesehen:
                continue
            if cur not in self.orte:
                raise SystemExit(f"Bibliothek fehlt: {cur}")
            gesehen.append(cur)
            info = self.json(cur, "library.json")
            arten = ["preloadedDependencies", "dynamicDependencies"] + (["editorDependencies"] if mit_editor else [])
            for art in arten:
                for d in info.get(art) or []:
                    offen.append(f"{d['machineName']}-{d['majorVersion']}.{d['minorVersion']}")
        return gesehen

    def ordner(self, machine):
        """Neueste vorhandene Version einer Bibliothek, z. B. H5P.MultiChoice → H5P.MultiChoice-1.16"""
        kandidaten = [k for k in self.orte if k.rsplit("-", 1)[0] == machine]
        if not kandidaten:
            raise SystemExit(f"Bibliothek {machine} nicht im Cache")
        return max(kandidaten, key=lambda k: tuple(int(x) for x in k.rsplit("-", 1)[1].split(".")))

    def voreinstellungen(self, lib):
        """Standardwerte aus semantics.json, Texte aus der deutschen Sprachdatei."""
        sem = self.json(lib, "semantics.json") or []
        tr = (self.json(lib, f"language/{LANG}.json") or {}).get("semantics", [])
        return _defaults(sem, tr)

    def schreibe(self, z, libs):
        for lib in libs:
            quelle = self.orte[lib]
            for n in quelle.namelist():
                if n.startswith(lib + "/") and not n.endswith("/"):
                    z.writestr(n, quelle.read(n))


def _defaults(felder, uebersetzung):
    out = {}
    for i, f in enumerate(felder):
        tr = uebersetzung[i] if i < len(uebersetzung) and isinstance(uebersetzung[i], dict) else {}
        v = _default(f, tr)
        if v is not None:
            out[f["name"]] = v
    return out


def _default(f, tr):
    t = f.get("type")
    if t == "group":
        fs, trs = f.get("fields", []), tr.get("fields", [])
        if len(fs) == 1 and not f.get("isSubContent"):
            return _default(fs[0], trs[0] if trs else {})  # H5P speichert Ein-Feld-Gruppen „flach“
        return _defaults(fs, trs)
    if t in ("list", "library"):
        return None
    return tr.get("default", f.get("default"))


def mische(basis, extra):
    for k, v in extra.items():
        if isinstance(v, dict) and isinstance(basis.get(k), dict):
            mische(basis[k], v)
        else:
            basis[k] = v
    return basis


def paket(libs, main_machine, content, titel, ziel, unterinhalte=()):
    main = libs.ordner(main_machine)
    runtime = []
    for lib in [main] + [libs.ordner(m) for m in unterinhalte]:
        for dep in libs.abhaengigkeiten(lib, mit_editor=False):
            if dep not in runtime:
                runtime.append(dep)
    alle = []
    for lib in runtime:
        for dep in libs.abhaengigkeiten(lib, mit_editor=True):
            if dep not in alle:
                alle.append(dep)

    def dep(k):
        name, ver = k.rsplit("-", 1)
        ma, mi = ver.split(".")
        return {"machineName": name, "majorVersion": ma, "minorVersion": mi}

    h5p = {"title": titel, "language": LANG, "mainLibrary": main_machine, "embedTypes": ["iframe"],
           "license": "U", "defaultLanguage": LANG, "preloadedDependencies": [dep(k) for k in runtime]}
    OUT.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(ziel, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("h5p.json", json.dumps(h5p, ensure_ascii=False))
        z.writestr("content/content.json", json.dumps(content, ensure_ascii=False))
        libs.schreibe(z, alle)
    print(f"{ziel.relative_to(ROOT)}  ({ziel.stat().st_size // 1024} KB)")


# ---------------------------------------------------------------- Kurz-Checks (Präsentieren)

def inline(s):
    """HTML der Seite → das, was H5P in Texten erlaubt (<kbd> wird fett)."""
    s = re.sub(r"<kbd>(.*?)</kbd>", r"<strong>\1</strong>", s)
    s = re.sub(r"<(?!/?(strong|em|b|i|sub|sup|u|code)\b)[^>]+>", "", s)
    return s.strip()


def kurzchecks(seite):
    text = (ROOT / seite).read_text(encoding="utf-8")
    fragen = []
    for m in re.finditer(r'<div class="qa" data-right="(\d+)">(.*?)</div>', text, re.S):
        right = int(m.group(1)) - 1
        body = m.group(2)
        q = re.search(r'<p class="q">(.*?)</p>', body, re.S).group(1)
        opts = re.findall(r"<li>(.*?)</li>", re.search(r"<ol>(.*?)</ol>", body, re.S).group(1), re.S)
        fb = re.search(r'<p class="fb"([^>]*)>', body).group(1)
        ok = html.unescape((re.search(r'data-ok="([^"]*)"', fb) or [None, ""])[1])
        no = html.unescape((re.search(r'data-no="([^"]*)"', fb) or [None, ""])[1])
        fragen.append({"q": inline(q), "opts": [inline(o) for o in opts], "right": right, "ok": ok, "no": no})
    return fragen


def modul_info(mid):
    js = (ROOT / "assets/js/app.js").read_text(encoding="utf-8")
    m = re.search(r'\{ id: "' + mid + r'", level: "\w+", file: "([^"]+)", title: "([^"]+)"', js)
    if not m:
        raise SystemExit(f"Unbekanntes Modul: {mid}")
    return m.group(1), m.group(2)


def baue_kurzcheck(libs, mid):
    datei, titel = modul_info(mid)
    fragen = kurzchecks(datei)
    if not fragen:
        print(f"{mid}: keine Kurz-Check-Fragen – übersprungen", file=sys.stderr)
        return
    mc_lib = libs.ordner("H5P.MultiChoice")
    mc_basis = libs.voreinstellungen(mc_lib)
    questions = []
    for i, f in enumerate(fragen, 1):
        params = mische(json.loads(json.dumps(mc_basis)), {
            "question": f"<p>{f['q']}</p>",
            "answers": [{"text": f"<div>{o}</div>", "correct": j == f["right"],
                         "tipsAndFeedback": {"tip": "", "notChosenFeedback": "",
                                             "chosenFeedback": f"<div>{f['ok'] if j == f['right'] else f['no']}</div>"}}
                        for j, o in enumerate(f["opts"])],
            "behaviour": {"type": "single", "singlePoint": True, "randomAnswers": True,
                          "enableRetry": True, "enableSolutionsButton": True},
            "overallFeedback": [{"from": 0, "to": 100}],
        })
        questions.append({"library": mc_lib.replace("-", " "), "params": params, "subContentId": str(uuid.uuid4()),
                          "metadata": {"contentType": "Multiple Choice", "license": "U", "title": f"Frage {i}"}})
    qs_lib = libs.ordner("H5P.QuestionSet")
    content = mische(libs.voreinstellungen(qs_lib), {
        "introPage": {"showIntroPage": False},
        "progressType": "dots",
        "passPercentage": 50,
        "disableBackwardsNavigation": False,
        "randomQuestions": False,
        "questions": questions,
    })
    content["endGame"]["overallFeedback"] = [
        {"from": 0, "to": 49, "feedback": "Schau dir das Modul noch einmal an und probier es dann erneut."},
        {"from": 50, "to": 99, "feedback": "Gut! Die falschen Antworten kannst du dir mit „Lösung anzeigen“ erklären lassen."},
        {"from": 100, "to": 100, "feedback": "Alles richtig – stark!"}]
    titel_h5p = f"Kurz-Check {mid.upper()}: {titel}"
    paket(libs, "H5P.QuestionSet", content, titel_h5p,
          OUT / f"lernpfad-praesentieren_{mid}_kurzcheck.h5p", unterinhalte=["H5P.MultiChoice"])


# ---------------------------------------------------------------- Lückentext (LF11c)

def baue_lueckentext(libs, lernpfad, aufgaben_id):
    for f in sorted((lernpfad / "content").glob("modul-*/aufgaben.yaml")):
        for a in yaml.safe_load(f.read_text(encoding="utf-8")):
            if a["id"] == aufgaben_id:
                break
        else:
            continue
        break
    else:
        raise SystemExit(f"Aufgabe {aufgaben_id} nicht gefunden")
    if a["typ"] != "lueckentext":
        raise SystemExit(f"{aufgaben_id} ist kein Lückentext")

    def esc(s):
        return s.replace("*", "").replace("/", " ").replace(":", " ")

    def luecke(m):
        d = a["luecken"][m.group(1)]
        varianten = []
        for w in d["akzeptiert"]:
            for v in (w, w.replace("-", " ")):
                if v not in varianten:
                    varianten.append(v)
        tipp = (":" + esc(d["hinweis"])) if d.get("hinweis") else ""
        return "*" + "/".join(esc(v) for v in varianten) + tipp + "*"

    satz = re.sub(r"\{\{\s*([a-z0-9_]+)\s*\}\}", luecke, a["text"].strip())
    lib = libs.ordner("H5P.Blanks")
    content = mische(libs.voreinstellungen(lib), {
        "text": f"<p>{html.escape(a['aufgabe'])}</p>",
        "questions": [f"<p>{html.escape(satz, quote=False)}</p>"],
        "behaviour": {"caseSensitive": False, "showSolutionsRequiresInput": True, "enableRetry": True,
                      "enableSolutionsButton": True, "autoCheck": False, "separateLines": False},
        "overallFeedback": [{"from": 0, "to": 100, "feedback": a.get("erklaerung", "")}],
    })
    titel = f"{a['id']} · {a['titel']}"
    paket(libs, "H5P.Blanks", content, titel, OUT / f"{aufgaben_id}_lueckentext.h5p")


def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ("kurzcheck", "lueckentext"):
        sys.exit(__doc__)
    libs = Bibliotheken(HUB_PAKETE)
    if sys.argv[1] == "kurzcheck":
        for mid in sys.argv[2:]:
            baue_kurzcheck(libs, mid)
    else:
        lernpfad = Path(sys.argv[2])
        for aid in sys.argv[3:]:
            baue_lueckentext(libs, lernpfad, aid)


if __name__ == "__main__":
    main()
