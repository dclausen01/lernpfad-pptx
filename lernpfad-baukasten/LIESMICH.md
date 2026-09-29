# Lernpfad-Baukasten – Installation und erster Start

Mit diesem Skill baust du zusammen mit Claude einen interaktiven Lernpfad im BBZ-Design. Heraus kommen
ein fertiger **Moodle-Kurs** zum Wiederherstellen und eine **Web-Version**. Du brauchst kein GitHub und
musst nicht programmieren können.

## Was du brauchst

- **Claude Desktop mit Claude Code** (Schul-Account)
- **Python 3** (ab 3.9). Unter Windows: Microsoft Store › „Python 3.12“ oder python.org. Test in der
  Eingabeaufforderung: `python --version`
- Für den automatischen Browser-Test: **Chrome oder Edge** (ist meistens schon da)

## Installieren (einmalig)

1. ZIP entpacken. Heraus kommt der Ordner `lernpfad-baukasten`.
2. Den Ordner an diese Stelle kopieren:
   - Windows: `C:\Users\<dein Name>\.claude\skills\lernpfad-baukasten`
   - Mac: `~/.claude/skills/lernpfad-baukasten` (im Finder: Gehe zu › Gehe zu Ordner › `~/.claude/skills`)

   Gibt es den Ordner `skills` noch nicht, lege ihn an. Am Ende muss dort
   `…/.claude/skills/lernpfad-baukasten/SKILL.md` liegen.
3. Claude Code neu starten. Den Rest (Python-Pakete) richtet Claude beim ersten Start mit dir ein.

## Loslegen

Öffne in Claude Code einen Arbeitsordner, zum Beispiel `Nextcloud/Lernpfade`, und schreib:

> Ich möchte mit dem Lernpfad-Baukasten einen Lernpfad zu **Tabellenkalkulation für die BFS** bauen.

Claude stellt dir ein paar Fragen und legt dir dann eine Gliederung vor. Erst wenn du sie freigibst, schreibt
Claude die Inhalte. Danach bekommst du die Web-Version zur Durchsicht. Nur Module, die du freigibst, landen
im Moodle-Kurs.

## Beispiele zum Anschauen

- `beispiele/dateien-ablegen/` – ein Mini-Lernpfad (4 Module), gut zum Ausprobieren
- `beispiele/praesentieren/` – der komplette Lernpfad Präsentieren (21 Module, PowerPoint/OnlyOffice)

Zum Ausprobieren: „Bau das Beispiel *dateien-ablegen* aus dem Lernpfad-Baukasten und zeig mir die Web-Version.“

## Hilfe

- Moodle-Kurs einspielen: `referenzen/moodle.md` (Abschnitt „Übergabe“)
- Etwas klappt nicht: Beschreib Claude, was passiert – die Skripte melden Fehler mit Datei und Zeile.
- Fragen und Ideen zum Skill: Dennis Clausen
