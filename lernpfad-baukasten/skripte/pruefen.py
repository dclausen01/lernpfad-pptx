#!/usr/bin/env python3
"""Prüft einen Lernpfad-Ordner, bevor gebaut wird.

    python3 pruefen.py [ordner]

Fehler (✗) verhindern das Bauen, Hinweise (!) sollte man sich ansehen. Die Meldungen nennen Datei und Stelle.
"""
import re
import sys
from pathlib import Path

from bausteine import unbekannte_bausteine
from gemeinsam import REVIEW, Fehler, Kurs, kurs_aus_argumenten

FRAGETYPEN = {"single_choice", "multiple_choice", "zuordnung", "reihenfolge", "lueckentext", "zahl", "offen"}


class Pruefer:
    def __init__(self, kurs):
        self.k = kurs
        self.fehler, self.hinweise = [], []

    def f(self, wo, text):
        self.fehler.append(f"{wo}: {text}")

    def h(self, wo, text):
        self.hinweise.append(f"{wo}: {text}")

    # ---------- kurs.yaml
    def kursdatei(self):
        k, wo = self.k.k, "kurs.yaml"
        if not k.get("titel"):
            self.f(wo, "„titel“ fehlt")
        if not re.fullmatch(r"[a-z0-9-]+", self.k.kurzname):
            self.f(wo, f"„kurzname“ nur aus Kleinbuchstaben, Ziffern und Bindestrichen (ist: {self.k.kurzname})")
        if not self.k.stufen:
            self.f(wo, "keine „stufen“ angegeben")
        ids = [s.get("id") for s in self.k.stufen]
        for s in self.k.stufen:
            for feld in ("id", "name", "module"):
                if not s.get(feld):
                    self.f(wo, f"Stufe {s.get('id', '?')}: „{feld}“ fehlt")
            if s.get("id") and not re.fullmatch(r"[a-z][a-z0-9-]*", s["id"]):
                self.f(wo, f"Stufen-ID „{s['id']}“: nur Kleinbuchstaben, Ziffern, Bindestrich")
        if len(ids) != len(set(ids)):
            self.f(wo, "Stufen-IDs doppelt")
        alle = [m for s in self.k.stufen for m in (s.get("module") or [])]
        doppelt = {m for m in alle if alle.count(m) > 1}
        if doppelt:
            self.f(wo, f"Module mehrfach in den Stufen: {', '.join(sorted(doppelt))}")
        var = k.get("varianten")
        if var and (not isinstance(var.get("optionen"), dict) or len(var["optionen"]) < 2):
            self.f(wo, "„varianten.optionen“ braucht mindestens zwei Einträge (id: Name)")
        sc = k.get("selbstcheck")
        if sc:
            for i, fr in enumerate(sc.get("fragen") or [], 1):
                if len(fr.get("antworten") or []) < 2:
                    self.f(wo, f"Selbstcheck-Frage {i}: mindestens zwei Antworten")
            for e in sc.get("empfehlung") or []:
                if e.get("stufe") not in ids:
                    self.f(wo, f"Selbstcheck-Empfehlung: unbekannte Stufe „{e.get('stufe')}“")
            if sc.get("empfehlung") and sc["empfehlung"][-1].get("bis") is not None:
                self.h(wo, "letzte Selbstcheck-Empfehlung ohne „bis“ angeben (fängt alle höheren Punktzahlen)")
        mo = self.k.moodle
        if mo.get("version", 5) not in (4, 5):
            self.f(wo, "moodle.version muss 4 oder 5 sein")
        if mo.get("freischaltung", "einstufung") not in ("einstufung", "offen"):
            self.f(wo, "moodle.freischaltung: einstufung oder offen")
        if mo.get("reihenfolge", "nacheinander") not in ("nacheinander", "frei"):
            self.f(wo, "moodle.reihenfolge: nacheinander oder frei")

    # ---------- Module
    def modul(self, m):
        wo = f"module/{m['id']}.md"
        var = set(((self.k.k.get("varianten") or {}).get("optionen") or {}))
        if m.get("review") not in REVIEW:
            self.f(wo, f"review muss {', '.join(REVIEW)} sein (ist: {m.get('review')})")
        if not m.get("titel") or m["titel"] == m["id"]:
            self.f(wo, "„titel“ fehlt")
        if not isinstance(m.get("minuten", 0), (int, float)):
            self.f(wo, "„minuten“ muss eine Zahl sein")
        if not m.get("meilenstein") and not m.get("lernziele"):
            self.h(wo, "keine Lernziele angegeben")
        for i, fr in enumerate(m.get("kurzcheck") or [], 1):
            ant = fr.get("antworten") or []
            if not fr.get("frage") or len(ant) < 2:
                self.f(wo, f"Kurz-Check {i}: „frage“ und mindestens zwei „antworten“ nötig")
            r = fr.get("richtig")
            if not isinstance(r, int) or not 1 <= r <= len(ant):
                self.f(wo, f"Kurz-Check {i}: „richtig“ muss die Nummer der richtigen Antwort sein (1–{len(ant)})")
        a = m.get("abgabe")
        if a:
            if a.get("dateitypen") and not re.fullmatch(r"(\.[a-z0-9]+)(,\s*\.[a-z0-9]+)*", str(a["dateitypen"])):
                self.f(wo, "abgabe.dateitypen z. B. „.pptx,.pdf“")
            if not isinstance(a.get("dateien", 1), int):
                self.f(wo, "abgabe.dateien muss eine Zahl sein")
        if m.get("meilenstein"):
            if not a:
                self.h(wo, "Meilenstein ohne „abgabe“ – in Moodle entsteht dann keine Abgabe-Aufgabe")
            if not m.get("raster"):
                self.h(wo, "Meilenstein ohne „raster“ – die Abgabe wird ohne Bewertungsraster angelegt")
        for i, z in enumerate(m.get("raster") or [], 1):
            if not z.get("kriterium") or not z.get("erreicht"):
                self.f(wo, f"Raster-Zeile {i}: „kriterium“ und „erreicht“ nötig")
        if m.get("h5p") and self.k.moodle.get("version", 5) == 4:
            self.h(wo, "h5p: true wirkt erst mit Moodle 5 (moodle.version: 5)")
        for mid in m.get("medien") or []:
            if mid not in self.k.medien:
                self.f(wo, f"Medium „{mid}“ steht nicht in medien.yaml")
        qids = {q.get("id") for q in self.k.quellen}
        for q in m.get("quellen") or []:
            if q not in qids:
                self.f(wo, f"Quelle „{q}“ steht nicht in quellen.yaml")
        self.text(wo, m["text"], var)

    def text(self, wo, text, var):
        for nr, name in unbekannte_bausteine(text):
            self.f(wo, f"Zeile {nr}: unbekannter Baustein „:::{name}“")
        for nr, z in enumerate(text.split("\n"), 1):
            m = re.match(r"^:{3,}\s*(variante|menueband|seitenleiste)\s+(\S+)", z)
            if m and var and m.group(2) not in var:
                self.f(wo, f"Zeile {nr}: Variante „{m.group(2)}“ gibt es nicht (vorhanden: {', '.join(sorted(var))})")
            if m and not var:
                self.f(wo, f"Zeile {nr}: „:::{m.group(1)}“ braucht „varianten“ in kurs.yaml")
            for ziel in re.findall(r"\(modul:([\w-]+)\)", z):
                if ziel not in self.k.module:
                    self.f(wo, f"Zeile {nr}: Link auf unbekanntes Modul „{ziel}“")
            for pfad in re.findall(r"(?:\]\(|^:{3,}\s*(?:material|screenshot)\s+)(material/[^\s)]+)", z):
                if not (self.k.ordner / pfad).exists():
                    (self.h if "screenshot" in z else self.f)(wo, f"Zeile {nr}: Datei „{pfad}“ fehlt"
                                                              + (" (Platzhalter wird angezeigt)" if "screenshot" in z else ""))
        offen = [z for z in text.split("\n") if re.match(r"^:{3,}\s*\w", z)]
        zu = [z for z in text.split("\n") if re.match(r"^:{3,}\s*$", z)]
        if len(offen) != len(zu):
            self.f(wo, f"{len(offen)} Bausteine geöffnet, aber {len(zu)} geschlossen – ein ::: fehlt oder ist zu viel")

    # ---------- Einstufung, Quellen, Fragen
    def einstufung(self):
        if not self.k.einstufung_aktiv():
            return
        for s in self.k.stufen[:-1]:
            if not any(m.get("kurzcheck") for m in self.k.module_der_stufe(s["id"])):
                self.h("kurs.yaml", f"Stufe „{s['name']}“ hat keine Kurz-Checks – für die nächste Stufe gibt es dann keinen Einstufungstest")

    def quellen(self):
        for q in self.k.quellen:
            wo = f"quellen.yaml ({q.get('id', '?')})"
            if not q.get("id") or not q.get("titel"):
                self.f(wo, "„id“ und „titel“ nötig")
            if q.get("status", "zu_pruefen") != "verifiziert":
                self.h(wo, "noch nicht verifiziert (status: verifiziert, geprueft_am: JJJJ-MM-TT)")

    def fragen(self):
        import yaml
        ids = set()
        for datei in sorted((self.k.ordner / "fragen").glob("*.yaml")):
            try:
                liste = yaml.safe_load(datei.read_text(encoding="utf-8")) or []
            except yaml.YAMLError as e:
                self.f(f"fragen/{datei.name}", f"YAML fehlerhaft – {e}")
                continue
            for a in liste:
                wo = f"fragen/{datei.name} ({a.get('id', '?')})"
                if a.get("id") in ids:
                    self.f(wo, "ID doppelt")
                ids.add(a.get("id"))
                if a.get("typ") not in FRAGETYPEN:
                    self.f(wo, f"unbekannter typ „{a.get('typ')}“")
                if a.get("modul") and a["modul"] not in self.k.module:
                    self.f(wo, f"unbekanntes Modul „{a['modul']}“")
                if a.get("typ") in ("single_choice", "multiple_choice"):
                    n = sum(1 for o in a.get("optionen") or [] if o.get("korrekt"))
                    if a["typ"] == "single_choice" and n != 1:
                        self.f(wo, f"single_choice braucht genau eine richtige Option (hat {n})")
                    if a["typ"] == "multiple_choice" and n < 1:
                        self.f(wo, "multiple_choice braucht mindestens eine richtige Option")
                if a.get("typ") == "lueckentext":
                    platz = set(re.findall(r"\{\{\s*(\w+)\s*\}\}", a.get("text", "")))
                    if platz != set(a.get("luecken") or {}):
                        self.f(wo, "Platzhalter im Text und „luecken“ passen nicht zusammen")

    def alles(self):
        self.kursdatei()
        for mid in self.k.reihenfolge:
            self.modul(self.k.module[mid])
        for s in self.k.seiten:
            self.text(f"seiten/{Path(s['quelle']).name}", s["text"], set(((self.k.k.get("varianten") or {}).get("optionen") or {})))
        self.einstufung()
        self.quellen()
        self.fragen()
        return not self.fehler


def pruefe(ordner, still=False):
    kurs = Kurs(ordner)
    p = Pruefer(kurs)
    ok = p.alles()
    if not still or not ok:
        for x in p.fehler:
            print(f"  ✗ {x}")
        for x in p.hinweise:
            print(f"  ! {x}")
    return ok, p


def main(argv=None):
    args = kurs_aus_argumenten(argv, __doc__).parse_args(argv)
    try:
        ok, p = pruefe(args.ordner)
    except Fehler as e:
        print(f"  ✗ {e}")
        sys.exit(1)
    freigegeben = sum(1 for m in p.k.module.values() if m.get("review") == "freigegeben")
    print(("✓ Keine Fehler" if ok else f"✗ {len(p.fehler)} Fehler") + f", {len(p.hinweise)} Hinweise · "
          f"{len(p.k.reihenfolge)} Module, {freigegeben} freigegeben")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
