# Quellcode der Übungsdateien

Die `.pptx`-Dateien im Ordner `material/` werden mit diesem Skript erzeugt. Du brauchst das nur, wenn du die Übungsdateien automatisch neu bauen willst. Einfacher ist meistens: die `.pptx` in PowerPoint öffnen, ändern und speichern.

```bash
cd material/_quelle
npm install pptxgenjs sharp
node build.js
python3 fixlinks.py ../p3-quiz-geruest.pptx   # Quiz-Links auf die ganzen Schaltflächen legen
```
