# Qualität: Nichts geht zu den Schüler:innen, was nicht geprüft ist

Die Regeln kommen aus LF 11c und gelten für Claude genauso wie für die Lehrkraft.

## Faktencheck (Schritt 4)

Prüfe jede überprüfbare Aussage:
- **Menüpfade, Knopfnamen, Tastenkürzel** – gegen die offizielle Hilfe des Herstellers in der Version, die an
  der Schule läuft (z. B. Microsoft 365 aktuell, OnlyOffice Desktop). Menünamen ändern sich – Stand notieren.
  Unterschiede Windows/Mac beachten.
- **Fachaussagen, Zahlen, Rechtliches** – gegen Lehrplan/Rahmenlehrplan, Normen, Gesetze (aktuelle Fassung),
  Fachliteratur. Keine Blogs oder KI-Zusammenfassungen als Beleg.
- **Links** in `medien.yaml` – erreichbar? Offizielle Quelle? Deutsch, wenn es das gibt?

Jeder Beleg kommt in `quellen.yaml` (`status: verifiziert`, `geprueft_am`, `belegt:` was genau), das Modul
verweist mit `quellen: [...]` darauf. **Was du nicht belegen kannst, schreibst du nicht als Tatsache**, sondern
markierst es für die Lehrkraft (in der Review-Liste und als `status: zu_pruefen`). Ohne Websuche: ehrlich
sagen, dass der Faktencheck bei der Lehrkraft liegt, und die kritischen Stellen auflisten.

## Review-Status

| Status | Bedeutung | Wer setzt ihn |
| --- | --- | --- |
| `entwurf` | geschrieben, noch nicht geprüft | Claude beim Schreiben |
| `geprueft` | Faktencheck und pruefen.py ohne Fehler | Claude nach Schritt 4 |
| `freigegeben` | Lehrkraft hat gelesen und ist einverstanden | **nur auf ausdrückliche Aussage der Lehrkraft** |

Nur `freigegeben` kommt in den Moodle-Kurs. Die Web-Version zeigt bei allen anderen einen Hinweis.
Nach größeren Änderungen an einem freigegebenen Modul: zurück auf `geprueft` und die Lehrkraft erneut fragen.

## Automatische Prüfung

`pruefen.py` läuft vor jedem Bauen. Es findet: Pflichtfelder, doppelte IDs, fehlende Moduldateien, falsche
Kurz-Check-Nummern, unbekannte Bausteine, nicht geschlossene `:::`, unbekannte Varianten, Links auf fehlende
Module/Dateien, Medien und Quellen ohne Eintrag, Fehler in `fragen/` (Anzahl richtiger Antworten,
Lücken ohne Lösung), Meilensteine ohne Abgabe/Raster. `durchklicken.py` findet JavaScript-Fehler, kaputte
Bilder, zu breite Seiten auf dem Handy und prüft, ob Kurz-Check und Checklisten reagieren.
Selbst prüfen musst du: Rechenformeln an den Rändern des Zahlenbereichs, Alternativtexte, ob Aufgaben zu den
Lernzielen passen, ob der Kurz-Check die Kernkompetenzen trifft.

## Urheberrecht

- Nur eigene Texte oder Material mit freier Lizenz (CC BY, CC BY-SA, CC0) – Lizenz und Urheber in
  `quellen.yaml` und sichtbar am Material.
- Screenshots von Programmoberflächen für den Unterricht: zulässig als Zitat/Illustration, keine Werbung,
  keine personenbezogenen Daten im Bild.
- Keine Prüfungsaufgaben der Kammern (IHK, HWK) nachbauen oder abschreiben, keine Schulbuchseiten.
- Videos nur verlinken, nicht herunterladen oder einbetten.

## Datenschutz

- Keine externen Dienste zur Laufzeit: Schriften liegen lokal, keine CDNs, kein Tracking.
- Fortschritt liegt nur im Browser der Schüler:innen (Web) bzw. in Moodle (Lernpaket).
- Keine echten Namen, Fotos oder Daten von Schüler:innen oder Kolleg:innen in Beispielen – ausgedachte
  Namen und Firmen verwenden.
- Die Kurssicherung enthält keine Personendaten.
