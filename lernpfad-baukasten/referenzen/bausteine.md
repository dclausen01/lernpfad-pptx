# Bausteine für Module und Seiten

Der Text eines Moduls ist Markdown (Überschriften `##`, Listen, **fett**, Tabellen, Links, Bilder). Dazu kommen
Bausteine: Sie beginnen mit `:::name …` und enden mit einer Zeile `:::`. Bausteine dürfen ineinander stecken –
einfach immer `:::` schreiben, die Verschachtelung erkennt `bauen.py` selbst. Unbekannte Namen meldet `pruefen.py`.

Überschriften: `##` für Abschnitte (nummeriert: „## 1. Schrift ändern“), `###` darunter. Die Modul-Überschrift
(`#`) erzeugt `bauen.py` aus dem Titel – nicht selbst schreiben.

## Kästen

```markdown
:::tipp
So sortieren sich Dateien automatisch nach Datum.
:::

:::achtung Typischer Fehler
Nicht auf dem Desktop speichern – da findet man nichts wieder.
:::

:::notiz 👉 Bevor du startest
Hinweis ohne Standardtitel.
:::

:::gestaltung
- Höchstens drei Farben
- Mindestens 24 pt Schrift
:::

:::ziele
- nur nötig, wenn die Lernziele nicht im Modulkopf stehen
:::
```

`tipp` 💡, `achtung` ⚠️, `notiz` (neutral), `gestaltung` ✏️ Gestaltungsregeln, `ziele` 🎯, `kasten` (schlicht,
z. B. um mehrere Checklisten). Ein Titel hinter dem Namen ersetzt den Standardtitel.

**Nur für eine Variante:** Jeder Baustein kann am Ende der Kopfzeile `{id}` bekommen –
`:::notiz Nur in PowerPoint {ppt}`, `:::schritte {oo}`, `:::screenshot material/x.png {ppt}`. Er erscheint dann
nur, wenn diese Variante gewählt ist.

## Aufgaben

```markdown
:::aufgabe basis 10 1 · Dein Schulordner
Lege einen Ordner **Schule** an und darin je einen Ordner pro Fach.

:::checkliste Selbstcheck
- Der Ordner „Schule“ existiert.
- Für jedes Fach gibt es einen Unterordner.
:::

:::loesung
So könnte es aussehen: …
:::
:::
```

`:::aufgabe <niveau> [minuten] Titel` – Niveau `basis` (alle), `plus` (weiterführend), `kreativ` (offen,
eigene Ideen), `pflicht` (grün wie Basis, heißt „Pflicht“). Minuten optional, `10+` heißt „10 min oder länger“.
`:::checkliste [Titel]` macht aus der Liste darin Häkchen, die gespeichert werden (Web: Browser, Moodle: im Kurs).
`:::loesung [Titel]` ist aufklappbar.

## Schritte

```markdown
:::schritte
1. Gehe in den Ordner.
2. Drücke ++Strg+Umschalt+N++.
3. Tippe den Namen und bestätige mit ++Enter++.
:::
```

Nummerierte Schrittfolge mit großen Ziffern – für Anleitungen immer diese statt einer normalen Liste.

## Varianten (mit Umschalter aus kurs.yaml)

```markdown
:::varianten
:::variante win
Öffne den **Explorer** mit ++Windows++ + ++E++.
:::
:::variante mac
Öffne den **Finder**.
:::
:::
```

Jede `:::variante <id>` erscheint nur, wenn oben diese Variante gewählt ist; bei „beide“ stehen sie im
`:::varianten`-Rahmen nebeneinander. Kurze Unterschiede im Fließtext: `<span class="win">Strg</span><span class="mac">Befehl</span>`.
Was für alle gleich ist, steht außerhalb – nicht doppelt schreiben. Eigene Beschriftung statt des Namens aus
kurs.yaml: `:::variante oo OnlyOffice (Browser)`.

## Menüpfade, Tasten, Links

| Schreibweise | Ergebnis |
| --- | --- |
| `{{Start › Schriftart › Fett}}` | Menüpfad als Kästchen (Trennzeichen ›, auf dem Mac: Alt+Umschalt+3 – oder einfach kopieren) |
| `++Strg+C++`, `++Enter++` | Tasten bzw. Tastenkombination |
| `[zum Modul E2](modul:e2)` | Link auf ein anderes Modul (Dateiname egal, in Moodle wird daraus Text) |
| `[Vorlage](material/vorlage.pptx)` | Link auf eine Datei in `material/` |
| `![Beschreibung](material/bild.png)` | Bild – Beschreibung = Alternativtext, immer ausfüllen |

## Material zum Herunterladen

```markdown
:::material material/uebung-e3.pptx Übungsdatei: Text gestalten
Enthält fünf Folien mit ungestaltetem Text.
:::
```

## Menüband und Seitenleiste (Schema-Grafiken statt Screenshots)

```markdown
:::menueband ppt Start
gruppen: Folien: Neue Folie, Layout | Schriftart: *1 Schriftart, *2 Größe, Fett | Absatz: Aufzählung
text: Die Gruppe „Schriftart“ auf der Registerkarte Start
:::

:::menueband oo Start
gruppen: Schriftart, *Größe, Fett
menue: Aufzählung|Punkte|*Zahlen
:::

:::seitenleiste ppt Hintergrund formatieren
zeilen: #Füllung|Einfarbig|*Farbverlauf|Bild- oder Texturfüllung
text: Aufgabenbereich rechts
:::
```

- `:::menueband <variante> <Registerkarte>`: Registerkarten aus `menueband:` in kurs.yaml, die genannte ist aktiv.
  Nicht aufgelistete Registerkarte = Kontext-Registerkarte (wird so beschriftet).
- `gruppen:` Gruppen mit `|` trennen, `Name: Knopf, Knopf`; `*` markiert, `*1` markiert mit Nummer.
- `menue:` aufgeklapptes Menü: erster Eintrag = Kopf, dann Einträge mit `|`.
- `zeilen:` bei der Seitenleiste: `#` = Zwischenüberschrift, `*` = markiert.
- Ohne Varianten in kurs.yaml gibt es diese beiden Bausteine nicht.

## Screenshots

```markdown
:::screenshot material/e3-schrift.png
Registerkarte Start, Gruppe Schriftart markiert.
:::
```

Solange die Datei fehlt, erscheint ein Platzhalter mit der Beschreibung – so sieht die Lehrkraft, welche Bilder
noch fehlen (`pruefen.py` listet sie als Hinweis). Screenshots nimmt die Lehrkraft selbst auf (keine
personenbezogenen Daten im Bild).

## Platzhalter für Kopf-Inhalte

`:::kurzcheck`, `:::abgabe`, `:::raster`, `:::medien` (jeweils sofort mit `:::` schließen) setzen Kurz-Check,
Abgabe-Kasten, Bewertungsraster und Videos aus dem Modulkopf an diese Stelle. Ohne Platzhalter stehen sie am Ende.

```markdown
## Zum Schluss

:::kurzcheck
:::
```

## Tabellen

Normale Markdown-Tabellen; auf dem Handy werden sie waagerecht scrollbar. Breite Tabellen (mehr als 4 Spalten)
möglichst vermeiden.

## HTML

HTML ist erlaubt, wenn ein Baustein nicht reicht (z. B. `<span class="win">`). Keine Skripte, keine
externen Einbettungen (iframes von YouTube usw.) – Videos gehören in `medien.yaml`.
