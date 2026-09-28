# Lernpfad Präsentieren – PowerPoint 365 & OnlyOffice

Ein webbasierter Lernpfad für Schüler:innen in der Erzieherausbildung und im beruflichen Gymnasium. Er führt in drei Stufen durch PowerPoint für Microsoft 365 **und** OnlyOffice. Bedienung, Foliengestaltung und Vortrag werden dabei verzahnt.

| Stufe | Module | Umfang | Meilenstein |
|---|---|---|---|
| 🌱 Einsteiger | E1–E6: Oberfläche, Folien & Layouts, Text, Design, Bilder & Formen, Präsentieren & PDF | ca. 4 × 45 min | eigene Präsentation (PPTX + PDF) |
| 🚀 Fortgeschrittene | F1–F7: Übergänge, Animationen, Ausrichten, Tabellen & Diagramme, SmartArt, Fußzeile & Links, Vortragen | ca. 4 × 45 min | Erklär-Präsentation + Kurzvortrag |
| 🏆 Profis | P1–P5: Folienmaster, Morphen, Interaktiv (Trigger/Quiz), Audio & Video, Barrierefreiheit & Teamarbeit | ca. 4 × 45 min | Profi-Projekt (4 Formate) |

## Funktionen

- **Programm-Umschalter** (PowerPoint 365 / OnlyOffice / beide nebeneinander). Die Schüler:innen sehen nur die Anleitung für ihr Programm.
- **Exakte Menüpfade**, abgeglichen mit dem deutschen Microsoft Support und dem deutschen ONLYOFFICE Hilfe-Center.
- **Schematische Menüband-Grafiken** mit markierten und nummerierten Schaltflächen (automatisch aus HTML-Attributen erzeugt).
- **Screenshot-Platzhalter**: Eine Bilddatei mit dem angezeigten Namen in `img/screens/` ablegen, dann erscheint sie automatisch.
- **Gestufte Aufgaben** (Basis / Plus / Kreativ) mit Checklisten zur Selbstkontrolle, aufklappbaren Lösungen und Kurz-Checks.
- **Zentrale Videoliste** (`assets/js/videos.js`) nur mit offiziellen Quellen, mit Prüf- und Freigabestatus.
- **Fortschritt** lokal im Browser (keine Anmeldung, keine Datenübertragung).

## Nutzung

- Online: GitHub Pages aktivieren (*Settings › Pages*) oder den Ordner auf einen Webserver legen.
- Offline: Ordner kopieren und `index.html` im Browser öffnen.

Hinweise zu Stundenplanung, Bewertung, Screenshots und Videopflege: `lehrkraefte.html`.

## Struktur

```
index.html              Startseite
e1-…em-…                Einsteiger-Module + Meilenstein
f1-…fm-…                Fortgeschrittene-Module + Meilenstein
p1-…pm-…                Profi-Module + Meilenstein
regeln.html             Spickzettel „Gute Folien“
videos.html             Videos & Hilfeseiten mit Prüfstatus
lehrkraefte.html        Hinweise für Lehrkräfte
assets/css/style.css
assets/js/app.js        Navigation, Umschalter, Schemagrafiken, Checklisten, Quiz
assets/js/videos.js     zentrale Linkliste
img/screens/            eigene Screenshots (optional)
```
