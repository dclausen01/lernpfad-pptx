#!/usr/bin/env python3
"""Baut aus Modulseiten des Lernpfads je ein SCORM-Paket für Moodle.

Ein Paket = ein Modul (Startseite) + Spickzettel + Videoliste + alle Dateien, die diese Seiten brauchen
(CSS, JS, Schriften, Bilder, Übungsdateien). Die Seiten bekommen zusätzlich scorm-config.js und scorm.js;
dadurch speichert app.js den Fortschritt in Moodle statt im Browser.

Aufruf (im Wurzelordner des Lernpfads):
    python3 moodle-poc/tools/build_scorm.py                    # alle Module, SCORM 2004
    python3 moodle-poc/tools/build_scorm.py e1 e3 em           # nur diese
    python3 moodle-poc/tools/build_scorm.py e3 --scorm 1.2     # SCORM 1.2 (Rückfalloption)
"""
import argparse
import json
import re
import sys
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "moodle-poc" / "dist" / "scorm"
EXTRA_PAGES = ["regeln.html", "videos.html"]
COURSE_ID = "lernpfad-praesentieren"
COURSE_TITLE = "Lernpfad Präsentieren"


def read_modules():
    """Modulliste (id, Datei, Titel) aus app.js lesen – dort ist sie ohnehin gepflegt."""
    js = (ROOT / "assets/js/app.js").read_text(encoding="utf-8")
    mods = []
    for m in re.finditer(r'\{ id: "(\w+)", level: "\w+", file: "([^"]+)", title: "([^"]+)"', js):
        mods.append({"id": m.group(1), "file": m.group(2), "title": m.group(3)})
    return mods


REF_RE = re.compile(r'(?:src|href|data-src)\s*=\s*"([^"#?]+)', re.I)
CSS_URL_RE = re.compile(r'url\(\s*["\']?([^"\')]+)')


def local_refs(text):
    for ref in REF_RE.findall(text):
        if re.match(r"^([a-z]+:|//|#|mailto:)", ref, re.I):
            continue
        yield ref


def collect(pages):
    """Alle lokalen Dateien einsammeln, die die Seiten (und das CSS) brauchen."""
    files = set(pages)
    for page in pages:
        for ref in local_refs((ROOT / page).read_text(encoding="utf-8")):
            if ref.endswith(".html"):
                continue  # andere Seiten nicht mitnehmen – app.js macht daraus Text
            if (ROOT / ref).is_file():
                files.add(ref)
    # Skripte und Stil immer, dazu alles, was das CSS lädt (Schriften)
    for f in ["assets/css/style.css", "assets/js/app.js", "assets/js/videos.js", "assets/js/scorm.js"]:
        files.add(f)
    css = (ROOT / "assets/css/style.css").read_text(encoding="utf-8")
    for ref in CSS_URL_RE.findall(css):
        p = (ROOT / "assets/css" / ref).resolve()
        if p.is_file():
            files.add(str(p.relative_to(ROOT)))
    # Lizenzen der Schriften gehören dazu
    for lic in (ROOT / "assets/fonts").glob("OFL-*.txt"):
        files.add(str(lic.relative_to(ROOT)))
    return sorted(files)


def inject(html):
    tag = '<script src="assets/js/scorm-config.js"></script>\n<script src="assets/js/scorm.js"></script>\n'
    i = html.find('<script src="assets/js/videos.js"')
    if i < 0:
        i = html.find("</head>")
    return html[:i] + tag + html[i:]


def manifest(ident, title, launch, files, version):
    files_xml = "\n".join(f'      <file href="{escape(f)}"/>' for f in files)
    if version == "1.2":
        return f"""<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="{ident}" version="1"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="org">
    <organization identifier="org">
      <title>{escape(title)}</title>
      <item identifier="item" identifierref="res" isvisible="true">
        <title>{escape(title)}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res" type="webcontent" adlcp:scormtype="sco" href="{escape(launch)}">
{files_xml}
    </resource>
  </resources>
</manifest>
"""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="{ident}" version="1"
  xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
  xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
  xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
  xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsglobal.org/xsd/imscp_v1p1 imscp_v1p1.xsd http://www.adlnet.org/xsd/adlcp_v1p3 adlcp_v1p3.xsd http://www.adlnet.org/xsd/adlseq_v1p3 adlseq_v1p3.xsd http://www.adlnet.org/xsd/adlnav_v1p3 adlnav_v1p3.xsd http://www.imsglobal.org/xsd/imsss imsss_v1p0.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  <organizations default="org">
    <organization identifier="org">
      <title>{escape(title)}</title>
      <item identifier="item" identifierref="res">
        <title>{escape(title)}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res" type="webcontent" adlcp:scormType="sco" href="{escape(launch)}">
{files_xml}
    </resource>
  </resources>
</manifest>
"""


def build(mod, version):
    pages = [mod["file"]] + EXTRA_PAGES
    files = collect(pages)
    config = {"module": mod["id"], "launch": mod["file"], "files": pages}
    files_with_cfg = sorted(files + ["assets/js/scorm-config.js"])
    ident = f"{COURSE_ID}-{mod['id']}"
    title = f"{mod['id'].upper()} · {mod['title']}" if not mod["id"].endswith("m") else mod["title"]
    OUT.mkdir(parents=True, exist_ok=True)
    tag = "scorm12" if version == "1.2" else "scorm2004"
    target = OUT / f"{COURSE_ID}_{mod['id']}_{tag}.zip"
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("imsmanifest.xml", manifest(ident, title, mod["file"], files_with_cfg, version))
        z.writestr("assets/js/scorm-config.js",
                   "window.LP_SCORM_CONFIG = " + json.dumps(config, ensure_ascii=False) + ";\n")
        for f in files:
            src = ROOT / f
            if f in pages:
                z.writestr(f, inject(src.read_text(encoding="utf-8")))
            else:
                z.write(src, f)
    return target


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("module", nargs="*", help="Modul-IDs, z. B. e1 e3 em (leer = alle)")
    ap.add_argument("--scorm", choices=["2004", "1.2"], default="2004")
    args = ap.parse_args()
    mods = read_modules()
    if args.module:
        wanted = set(args.module)
        unknown = wanted - {m["id"] for m in mods}
        if unknown:
            sys.exit("Unbekannte Module: " + ", ".join(sorted(unknown)))
        mods = [m for m in mods if m["id"] in wanted]
    for m in mods:
        t = build(m, args.scorm)
        print(f"{t.relative_to(ROOT)}  ({t.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
