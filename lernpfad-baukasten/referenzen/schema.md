# Inhaltsschema

Ein Lernpfad ist ein Ordner. Gepflegt wird nur, was hier steht; `ausgabe/` wird erzeugt.

```
mein-lernpfad/
  kurs.yaml          Kursbeschreibung: Titel, Stufen mit Modul-Reihenfolge, Varianten, Selbstcheck, Moodle
  module/<id>.md     ein Modul: YAML-Kopf + Text mit Bausteinen
  seiten/<name>.md   Zusatzseiten, z. B. Spickzettel, Glossar (optional)
  medien.yaml        Videos und Hilfeseiten, auf die Module per ID verweisen (optional)
  quellen.yaml       Quellen mit Prüfstatus (empfohlen)
  fragen/*.yaml      Fragen für Moodle-Tests (optional)
  material/          Bilder, Screenshots, Übungsdateien
  ausgabe/           wird erzeugt – nicht von Hand ändern
```

IDs (Stufen, Module, Fragen, Medien) bestehen aus Kleinbuchstaben, Ziffern und Bindestrich und ändern sich
nach der Freigabe nicht mehr: Daran hängen der Fortschritt der Schüler:innen und die Zuordnung in Moodle.
Übliche Modul-IDs: erster Buchstabe der Stufe + Nummer (`e1`, `e2` …), Meilenstein mit `m` (`em`).

## kurs.yaml

```yaml
titel: Lernpfad Präsentieren            # Pflicht; erscheint oben links und als Moodle-Kursname
kurzname: praesentieren                 # Pflicht; a-z, 0-9, -; Dateinamen und Speicherschlüssel
ueberschrift: Präsentieren mit PowerPoint & OnlyOffice   # große Überschrift der Übersicht
untertitel: Du lernst … Schritt für Schritt.             # Satz unter der Überschrift (auch Moodle-Kursbeschreibung)
badges: [PowerPoint 365, OnlyOffice, 3 Stufen · ca. 12 Std.]
fusszeile: BBZ Rendsburg-Eckernförde · Stand 10/2026    # HTML erlaubt
logo_zeichen: "▶"                       # Zeichen im Logo-Quadrat oben links (Standard ▶)
logo: material/logo.png                 # optional: Bild in der Übersicht
sprache: de
abgabe_link: https://…                  # nur Web-Version: Link zu einem Abgabeformular (Moodle nutzt Aufgaben)

einleitung: |                           # Text auf der Übersicht, mit Bausteinen
  :::notiz 👉 Bevor du startest
  1. Stell oben ein, womit du arbeitest.
  :::

varianten:                              # optional: Umschalter oben rechts
  frage: "Ich arbeite mit:"
  optionen: {ppt: PowerPoint 365, oo: OnlyOffice}   # id: Anzeigename; mind. zwei
  beide: true                           # zusätzlicher Knopf „beide“ (Anleitungen nebeneinander)

menueband:                              # optional, nur mit Varianten: Registerkarten je Variante
  ppt: [Datei, Start, Einfügen, Entwurf, Übergänge, Animationen]
  oo: [Datei, Start, Einfügen, Übergänge, Animation]

stufen:                                 # Pflicht; Reihenfolge = Pfad-Reihenfolge
  - id: einsteiger
    name: Einsteiger
    icon: "🌱"
    text: Oberfläche, Folien, Text, Design, Bilder und Präsentieren.
    module: [e1, e2, e3, em]            # Reihenfolge der Module; jede ID braucht module/<id>.md
  - id: fortgeschrittene
    name: Fortgeschrittene
    icon: "🚀"
    text: …
    module: [f1, f2, fm]

selbstcheck:                            # optional: Einstiegsempfehlung auf der Übersicht/Startseite
  fragen:                               # Antworten zählen 0, 1, 2 … Punkte (erste Antwort = 0)
    - frage: Hast du schon Präsentationen erstellt?
      antworten: [Nie, Ein paarmal, Oft]
  empfehlung:                           # von oben nach unten; erste passende gilt
    - {bis: 2, stufe: einsteiger, hinweis: Starte mit E1.}
    - {bis: 4, stufe: fortgeschrittene, hinweis: …}
    - {stufe: profis, hinweis: …}       # letzte ohne „bis“

einstufung: {bestehen: 80}              # Einstufungstests: Prozent zum Bestehen (Fragen = Kurz-Checks der vorigen Stufe)

nur_freigegebene_medien: false          # true: nur Medien mit „freigegeben“ zeigen

moodle:
  version: 4                            # 4 = ohne Unterabschnitte (Standard bis zum Update), 5 = mit Unterabschnitten + H5P
  freischaltung: einstufung             # einstufung (Modell A) | offen (Modell B)
  reihenfolge: nacheinander             # nacheinander | frei (innerhalb einer Stufe)
  raster_punkte: [0, 2, 3]              # Punkte für nicht erreicht / erreicht / besonders gut
```

## module/<id>.md

```markdown
---
titel: Text gestalten                   # Pflicht
minuten: 45                             # Zeitbedarf; Summe je Stufe erscheint in der Navigation
review: entwurf                         # entwurf | geprueft | freigegeben (nur die Lehrkraft setzt freigegeben)
lernziele:                              # 2–4, beginnen mit Verb; erscheinen als Kasten oben
  - Schriftart, -größe und -farbe ändern,
  - Aufzählungen gliedern.
kurzcheck:                              # 2–4 Fragen; auch Quelle für Einstufungstest und H5P
  - frage: Wo änderst du die Schriftgröße?
    antworten: ["{{Start › Schriftart}}", "{{Einfügen › Text}}", "{{Entwurf › Varianten}}"]
    richtig: 1                          # Nummer der richtigen Antwort (ab 1)
    richtig_text: Genau – alles zur Schrift steht auf „Start“.
    falsch_text: Schau nochmal auf die Registerkarte „Start“.
abgabe:                                 # optional: Moodle-Aufgabe unter dem Lernpaket (Zwischenabgabe/Meilenstein)
  titel: Zwischenstand hochladen
  text: Lade deine Präsentation mit den gefüllten Inhaltsfolien hoch.   # Markdown
  punkte: 10                            # Standard 100
  dateitypen: .pptx,.pdf                # optional
  dateien: 1                            # höchstens so viele Dateien
  option: "Einsteiger: Meilenstein"     # nur Web-Version mit abgabe_link
  nur_moodle: true                      # Abgabe-Kasten nicht in der Web-Version zeigen
meilenstein: true                       # Meilenstein-Modul (★, schaltet in Modell A die nächste Stufe frei)
raster:                                 # Bewertungsraster (Moodle: Rubrik an der Abgabe)
  - {kriterium: Aufbau, erreicht: Titel-, Inhalts- und Schlussfolie, besonders_gut: roter Faden erkennbar}
  - {kriterium: Gestaltung, erreicht: einheitliches Design, besonders_gut: eigene Farbwelt}
medien: [ms-text, oo-text]              # IDs aus medien.yaml → Kasten „Videos & Hilfe“
quellen: [q-ms-schrift]                 # IDs aus quellen.yaml (Nachweis für die Prüfung)
h5p: true                               # Kurz-Check zusätzlich als H5P-Aktivität (nur Moodle 5)
datei: e3-text.html                     # optional: fester Dateiname (sonst <id>-<titel>.html)
---
## 1. Schrift ändern

Text mit Bausteinen (siehe bausteine.md) …
```

Wo Kurz-Check, Abgabe, Raster und Medien erscheinen: an der Stelle von `:::kurzcheck`, `:::abgabe`,
`:::raster`, `:::medien` im Text – sonst automatisch am Ende des Moduls (Abgabe, Raster, Kurz-Check, Medien).

## seiten/<name>.md

```markdown
---
titel: "Spickzettel: Tastenkürzel"
icon: "⌨️"
beschreibung: Alle Kürzel auf einer Seite.   # Text auf der Karte „Immer griffbereit“
reihenfolge: 1
---
Inhalt mit Bausteinen …
```

Zusatzseiten stehen in der Navigation unter „Extras“ und sind in jedem Lernpaket enthalten.

## medien.yaml

```yaml
ms-text:                                # ID, auf die Module verweisen
  app: ppt                              # Varianten-ID (optional) – wird mit dem Umschalter ein-/ausgeblendet
  type: hilfe                           # video | hilfe | kurs
  lang: de                              # de | en
  source: Microsoft Support
  title: Schriftart ändern
  url: https://support.microsoft.com/…
  duration: "2:30"                      # optional, bei Videos
  hint: Ab 1:10 wird es spannend.       # optional
  linkGeprueft: 2026-09-28
  freigegeben: "2026-09-30 DC"          # Datum + Kürzel der Lehrkraft (wirkt mit nur_freigegebene_medien)
```

Nur offizielle Quellen verlinken (Hersteller, öffentlich-rechtlich, Bildungsserver). Nichts einbetten.

## quellen.yaml

```yaml
- id: q-ms-schrift
  titel: Ändern der Schriftart (Microsoft Support)
  url: https://support.microsoft.com/…
  art: hersteller                       # hersteller | lehrplan | norm | gesetz | fachliteratur | eigene
  lizenz: ""                            # bei übernommenem Material: z. B. CC BY 4.0
  status: verifiziert                   # zu_pruefen | verifiziert
  geprueft_am: 2026-09-28
  belegt: Menüpfad Start › Schriftart, Tastenkürzel Strg+Umschalt+F
```

## fragen/*.yaml – Fragen für Moodle-Tests

Eine Liste von Fragen. `modul` ordnet sie einer Kategorie zu (sonst Kategorie = Dateiname).
Gemeinsame Felder: `id` (eindeutig, wird Moodle-ID-Nummer), `modul`, `typ`, `titel`, `aufgabe` (Markdown,
Bilder als `![Alt](material/bild.png)`), `erklaerung` (Feedback), `review`, `niveau` (1–3).

```yaml
- id: t-01
  modul: e3
  typ: single_choice                    # genau eine richtige; multiple_choice: mind. eine
  aufgabe: Wo änderst du die Schriftgröße?
  optionen:
    - {text: Start › Schriftart, korrekt: true}
    - {text: Einfügen › Text, korrekt: false, feedback: Da fügst du Textfelder ein.}

- id: t-02
  typ: zuordnung
  aufgabe: Ordne zu.
  kategorien: [Start, Einfügen]         # Kategorien ohne Element werden Ablenker
  elemente:
    - {text: Fett, kategorie: Start, feedback: …}
    - {text: Bild, kategorie: Einfügen}

- id: t-03
  typ: reihenfolge                      # Anordnung; Moodle ab 4.4 (4.2: Plugin qtype_ordering)
  aufgabe: Bring in die richtige Reihenfolge.
  elemente: [Erst das, dann das, zum Schluss das]
  feedback_richtig: …
  feedback_falsch: …

- id: t-04
  typ: lueckentext
  aufgabe: Ergänze.
  text: "Das Datum steht vorne im Format Jahr-{{a}}-Tag."
  luecken:
    a: {akzeptiert: [Monat, MM], hinweis: zwischen Jahr und Tag}

- id: t-05
  typ: zahl                             # Rechenaufgabe; mit parameter → Varianten für Zufallsfragen
  aufgabe: "{{n}} Dateien à {{mb}} MB – wie viel Speicher?"
  parameter:
    n: {min: 10, max: 30, schritt: 5}
    mb: {min: 2, max: 4, schritt: 1}
  antworten:
    - {id: summe, label: Speicher, formel: "n * mb", runden: 0, toleranz: 0, einheit: MB}
  loesungsweg: "{{n}} · {{mb}} MB = {{summe}} MB"

- id: t-06
  typ: offen                            # Freitext, manuell bewertet
  aufgabe: Beschreibe …
  musterloesung: …
  checkliste: [Punkt 1, Punkt 2]
  punkte: 4
```

Formeln: `+ - * / ^`, Klammern, `abs sqrt min max floor ceil round ln log10 exp`. Rechne die Randwerte des
Zahlenbereichs einmal nach (kein Teilen durch 0, sinnvolle Ergebnisse).
