---
name: lernpfad-baukasten
description: Baut mit einer Lehrkraft einen interaktiven Lernpfad (Stufen, Module, Aufgaben in drei Niveaus, Kurz-Checks, Meilensteine mit Bewertungsraster) und liefert ihn als fertigen Moodle-Kurs (.mbz mit SCORM-Lernpaketen, Abgaben, Freischaltungen) plus Web-Version. Nutzen, wenn jemand einen Lernpfad, eine Selbstlerneinheit, eine Unterrichtsreihe zum Selbstlernen oder einen Moodle-Kurs daraus erstellen, ändern oder neu bauen möchte.
---

# Lernpfad-Baukasten

Du baust zusammen mit einer Lehrkraft einen Lernpfad im BBZ-Design. Die Lehrkraft bringt Thema, Klasse und
Erfahrung mit; du schreibst, prüfst und baust. Am Ende hat sie einen Moodle-Kurs zum Wiederherstellen und eine
Web-Version. Die Lehrkraft braucht dafür kein GitHub, kein Node.js und keine Programmierkenntnisse.

**Eine Quelle, viele Ausgaben:** Alle Inhalte stehen als Markdown/YAML in einem Ordner (`kurs.yaml`,
`module/*.md` …). Alles in `ausgabe/` wird daraus erzeugt – nie von Hand ändern, sondern die Quelle
ändern und neu bauen.

## Referenzen – lies sie, bevor du den jeweiligen Schritt machst

| Datei | Wann lesen |
| --- | --- |
| `referenzen/didaktik.md` | vor der Gliederung und vor dem Schreiben (Stufen, Niveaus, Aufgaben, Sprache) |
| `referenzen/schema.md` | vor dem ersten Anlegen von Dateien – alle Felder von kurs.yaml, Modulen, Fragen, Medien |
| `referenzen/bausteine.md` | beim Schreiben der Module (Kästen, Aufgaben, Varianten, Menüband …) |
| `referenzen/moodle.md` | bei Fragen zu Moodle, Freischaltung, Abgaben, Moodle 4 vs. 5, Übergabe |
| `referenzen/qualitaet.md` | vor dem Prüfen: Faktencheck, Quellen, Review, Urheberrecht, Datenschutz |

Ein vollständiges kleines Beispiel liegt in `beispiele/dateien-ablegen/` – schau es dir an, wenn du unsicher
bist, wie etwas aussieht.

## Skripte

Alle liegen in `skripte/` dieses Skills und bekommen den Ordner des Lernpfads als Argument. Unter Windows
heißt Python oft `python` oder `py` statt `python3`.

| Befehl | Was es tut |
| --- | --- |
| `python3 <skill>/skripte/neu.py <ordner> --titel "…" --stufen "A,B,C" [--varianten "x:X,y:Y"] [--moodle 4]` | Gerüst für einen neuen Pfad |
| `python3 <skill>/skripte/pruefen.py <ordner>` | Schema- und Inhaltsprüfung (✗ Fehler, ! Hinweise) |
| `python3 <skill>/skripte/bauen.py <ordner>` | Web-Version → `ausgabe/web/` (prüft vorher) |
| `python3 <skill>/skripte/durchklicken.py <ordner>` | Browser-Test Desktop + Handy → `ausgabe/pruefung/uebersicht.html` |
| `python3 <skill>/skripte/moodle_kurs.py <ordner> [--moodle 4\|5] [--entwuerfe]` | Moodle-Kurs (.mbz) + Klickanleitung + Lernpakete |
| `python3 <skill>/skripte/h5p.py <ordner>` | H5P-Kurz-Checks (nur Moodle 5, Module mit `h5p: true`) |
| `python3 <skill>/skripte/moodle_xml.py <ordner>` | `fragen/*.yaml` → Moodle-XML für die Fragensammlung |
| `python3 <skill>/skripte/alles.py <ordner> [--moodle 4\|5] [--entwuerfe]` | alles in einem Rutsch |

**Voraussetzungen prüfen (einmal zu Beginn):** `python3 -c "import yaml, markdown_it, mdit_py_plugins"`.
Fehlt etwas: `python3 -m pip install --user pyyaml markdown-it-py mdit-py-plugins`. Für den Browser-Test
zusätzlich `python3 -m pip install --user playwright` – ein installierter Chrome oder Edge reicht, kein
Browser-Download nötig. Klappt das nicht, läuft `durchklicken.py --nur-links` ohne Browser; sag der Lehrkraft
dann, dass sie die Web-Version selbst kurz anklicken soll.

## Ablauf: 8 Schritte, 2 Haltepunkte

Die Lehrkraft entscheidet an zwei Haltepunkten (🛑). Dazwischen arbeitest du selbstständig und meldest dich
nur mit echten Rückfragen. Sprich locker, ohne Fachjargon (nicht „YAML“, „SCORM-Manifest“, sondern
„Kursbeschreibung“, „Lernpaket“). Stelle Fragen gebündelt, nicht einzeln hintereinander.

### 1 Interview

Frag in **einer** Nachricht (mit Vorschlägen, damit die Lehrkraft nur ankreuzen/ergänzen muss):

1. **Thema und Ziel:** Was sollen die Schüler:innen am Ende können? Gibt es Lehrplanbezug (Lernfeld, Fach)?
2. **Zielgruppe:** Klasse/Bildungsgang, Vorwissen, wie heterogen?
3. **Umfang:** wie viele Unterrichtsstunden (à 45 min), im Unterricht oder zu Hause?
4. **Pfadmodell:** Stufen nacheinander mit Meilensteinen (Standard) – wie viele Stufen? Oder parallele Pfade?
5. **Varianten-Umschalter?** z. B. zwei Programme (PowerPoint/OnlyOffice, Windows/Mac) – oder keiner.
6. **Moodle:** Version 4 (Standard, bis zum Update) oder 5? Freischaltung Modell A „Einstufung“ (Standard:
   nächste Stufe nach Meilenstein **oder** bestandenem Einstufungstest) oder Modell B „Stufen offen“?
   Module innerhalb der Stufe nacheinander (Standard) oder frei?
7. **Zwischenabgaben:** Welche Aufgaben sollen in Moodle hochgeladen und bewertet werden? (Vorschlag:
   Meilensteine immer, dazu 1–2 Zwischenstände pro Stufe.) H5P-Kurz-Checks gewünscht (nur Moodle 5)?
8. **Material:** Gibt es eigene Übungsdateien, Arbeitsblätter, Bilder, Screenshots, Quellen, die rein sollen?
9. **Wo speichern?** Ordner vorschlagen, z. B. `Nextcloud/Lernpfade/<thema>`.

Lege danach mit `neu.py` das Gerüst an.

### 2 Gliederung 🛑 Haltepunkt 1

Lies `referenzen/didaktik.md`. Lege eine Gliederung als übersichtliche Tabelle vor – nicht als Datei-Dump:
Stufen mit Zeitbedarf; je Modul Titel, 2–4 Lernziele, Minuten, Aufgaben (Basis/Plus/Kreativ), Kurz-Check ja/nein,
Zwischenabgabe ja/nein; je Meilenstein Auftrag in einem Satz, Dateitypen und die Kriterien des
Bewertungsrasters. Nenne dazu das Freischaltmodell in einem Satz.

**Warte auf Freigabe oder Änderungswünsche.** Erst danach schreibst du Inhalte. IDs (`e1`, `em`, `f1` …)
stehen ab jetzt fest.

### 3 Inhalte

Trage die Gliederung in `kurs.yaml` ein und schreibe die Module (`module/<id>.md`) nach
`referenzen/schema.md` und `referenzen/bausteine.md`. Jedes Modul bleibt `review: entwurf`.
- Anleitungen Schritt für Schritt, Menüpfade als `{{Start › Neue Folie}}`, Tasten als `++Strg+C++`.
- Bei Varianten: Unterschiede in `:::variante <id>`, Gemeinsames einmal.
- Aufgaben in drei Niveaus, Checklisten zum Abhaken, Lösungen aufklappbar.
- Kurz-Check: 2–4 Fragen je Modul, falsche Antworten sind typische Fehlvorstellungen, Rückmeldung erklärt.
- Meilenstein-Modul: `meilenstein: true`, `abgabe:` und `raster:` im Kopf.
- Material der Lehrkraft nach `material/`. Fehlende Screenshots als `:::screenshot`-Platzhalter mit Beschreibung.
- Optional: `seiten/` (Spickzettel), `medien.yaml` (Videos), `fragen/` (Moodle-Tests), `quellen.yaml`.

### 4 Prüfen

Lies `referenzen/qualitaet.md`. Prüfe jede Fachaussage, jeden Menüpfad und jedes Tastenkürzel gegen
offizielle Quellen (Hersteller-Hilfe, Lehrplan) – mit Websuche, wenn verfügbar – und trage die Quellen mit
Datum in `quellen.yaml` ein. Was du nicht belegen kannst, markierst du für die Lehrkraft. Setze geprüfte
Module auf `review: geprueft` (nie selbst auf `freigegeben`). Dann `pruefen.py`, bis es keine ✗ mehr gibt;
Hinweise (!) bewerten und beheben oder begründen.

### 5 Review 🛑 Haltepunkt 2

`bauen.py` und `durchklicken.py` laufen lassen. Gib der Lehrkraft:
- den Pfad zu `ausgabe/web/index.html` (im Browser öffnen; Entwürfe sind dort markiert),
- `ausgabe/pruefung/uebersicht.html` (alle Seiten auf einen Blick, Desktop und Handy),
- eine kurze Liste, was sie besonders prüfen sollte (unsichere Stellen, fehlende Screenshots, Quellen).

Änderungswünsche setzt du in der Quelle um und baust neu. **Nur die Lehrkraft gibt frei.** Sagt sie
„Modul X ist freigegeben“ (oder „alles“), setzt du `review: freigegeben`.

### 6 Ausgaben bauen

`alles.py <ordner>` (Moodle-Version aus `kurs.yaml`). Nur freigegebene Module kommen in den Moodle-Kurs.
Für einen Testkurs vorab geht `--entwuerfe` – dann ausdrücklich dazusagen, dass es kein Kurs für
Schüler:innen ist.

### 7 Durchklicken

`alles.py` klickt die Web-Version durch. Schau dir die Übersicht selbst an (Screenshots öffnen), behebe
Probleme und baue neu. Melde, was du nicht beheben konntest.

### 8 Übergabe

Erkläre der Lehrkraft in wenigen Schritten (Details: `referenzen/moodle.md` › Übergabe):
1. Leeren Moodle-Kurs anlegen lassen oder eigenen nehmen → **Mehr › Wiederverwendung › Wiederherstellen**
   → `ausgabe/moodle/<kurzname>_moodle4.mbz` hochladen → „In diesen Kurs, Inhalte hinzufügen“ → durchklicken.
2. Als Schüler:in testen („Rolle wechseln“ zeigt keine Abschlüsse – besser ein Testkonto).
3. Klappt Wiederherstellen nicht (Rechte): `ANLEITUNG_moodle4.md` beschreibt denselben Kurs zum Nachklicken.
4. Fragen für Moodle-Tests (falls gebaut): Fragensammlung › Import › Moodle-XML.

## Später: Korrekturen und Erweiterungen

- Immer in der Quelle ändern, dann neu bauen. Nie Dateien in `ausgabe/` bearbeiten.
- **Ein Modul korrigieren, Kurs läuft schon:** nur das Lernpaket austauschen – in Moodle beim Lernpaket
  › Einstellungen › Paketdatei die neue ZIP aus `ausgabe/moodle/lernpakete/` hochladen. Der Fortschritt
  der Schüler:innen bleibt, solange die Modul-ID gleich bleibt. Den Kurs nicht neu wiederherstellen
  (sonst doppelte Aktivitäten).
- **Neues Modul in laufendem Kurs:** Lernpaket einzeln anlegen (Einstellungen wie in der Klickanleitung),
  Voraussetzung setzen.
- IDs von Modulen, Stufen und Fragen nach der Freigabe nie ändern.

## Regeln

- Nichts erfinden: keine Menüpfade, Tastenkürzel, Paragrafen, Zahlen ohne Beleg. Lieber als offen markieren.
- Keine personenbezogenen Daten, keine Namen von Schüler:innen, keine Kammer-Prüfungsaufgaben nachbauen,
  nur eigene oder frei lizenzierte Materialien (Quelle angeben).
- Keine externen Dienste zur Laufzeit: keine CDN-Schriften, keine eingebetteten Fremd-Skripte. Videos nur
  als Link auf offizielle Quellen (`medien.yaml`).
- Die Vorlage (`vorlage/`) nicht pro Kurs ändern. Farben kommen automatisch aus den Stufen.
- Sprache für Schüler:innen: du-Form, kurze Sätze, aktiv, konkrete Handlungsanweisungen, gendern mit Doppelpunkt.
