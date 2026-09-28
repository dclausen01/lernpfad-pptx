# Verschiebt Folien-Links von der Textebene auf die ganze Form (Button klickbar).
import re, sys, zipfile, shutil
src = sys.argv[1]; tmp = src + ".tmp"
zin = zipfile.ZipFile(src); zout = zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED)
HL = re.compile(r'<a:hlinkClick\b([^>]*?)(?:/>|>.*?</a:hlinkClick>)', re.S)
n = 0
for item in zin.infolist():
    data = zin.read(item.filename)
    if re.match(r'ppt/slides/slide\d+\.xml$', item.filename):
        s = data.decode("utf-8")
        def fix_sp(m):
            global n
            sp = m.group(0)
            h = HL.search(sp)
            if not h or '<p:cNvPr' not in sp: return sp
            attrs = h.group(1)
            rid = re.search(r'r:id="([^"]+)"', attrs).group(1)
            tip = re.search(r'tooltip="([^"]*)"', attrs)
            sp = HL.sub('', sp)                       # Link am Text entfernen
            sp = sp.replace(' u="sng"', '')           # Unterstreichung weg
            link = f'<a:hlinkClick r:id="{rid}" action="ppaction://hlinksldjump"' + (f' tooltip="{tip.group(1)}"' if tip else '') + '/>'
            sp = re.sub(r'(<p:cNvPr\b[^>]*?)(/>|>\s*</p:cNvPr>)', lambda c: c.group(1) + '>' + link + '</p:cNvPr>', sp, count=1)
            n += 1
            return sp
        s = re.sub(r'<p:sp>.*?</p:sp>', fix_sp, s, flags=re.S)
        data = s.encode("utf-8")
    zout.writestr(item, data)
zout.close(); shutil.move(tmp, src); print("Links umgesetzt:", n)
