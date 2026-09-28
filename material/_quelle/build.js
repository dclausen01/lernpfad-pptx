// Erzeugt die Übungsdateien für den Lernpfad Präsentieren.
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const OUT = require("path").join(__dirname, "..") + "/";

const C = { deep: "16323A", accent: "C85A2A", ink: "1D2B30", muted: "5D6C71", sand: "EFE9DE", white: "FFFFFF", green: "3D6B4A" };
const HEAD = "Cambria", BODY = "Calibri";

function newDeck(title) {
  const p = new pptxgen();
  p.layout = "LAYOUT_16x9"; // 10 x 5.625 in
  p.author = "Lernpfad Präsentieren · BBZ Rendsburg-Eckernförde";
  p.title = title;
  return p;
}

// Anleitungsfolie am Anfang jeder Übungsdatei
function introSlide(p, modul, titel, schritte, hinweis) {
  const s = p.addSlide();
  s.background = { color: C.deep };
  s.addText(`Übungsdatei · ${modul}`, { x: 0.6, y: 0.45, w: 8.8, h: 0.4, fontFace: BODY, fontSize: 14, color: "E2B34A", bold: true, margin: 0, isTextBox: true });
  s.addText(titel, { x: 0.6, y: 0.85, w: 8.8, h: 0.9, fontFace: HEAD, fontSize: 34, color: C.white, margin: 0, isTextBox: true });
  s.addText(schritte.map((t, i) => ({ text: t, options: { bullet: { type: "number" }, breakLine: i < schritte.length - 1 } })),
    { x: 0.6, y: 1.9, w: 8.8, h: 2.6, fontFace: BODY, fontSize: 16, color: C.white, paraSpaceAfter: 6, valign: "top", margin: 0, isTextBox: true });
  if (hinweis) s.addText(hinweis, { x: 0.6, y: 4.75, w: 8.8, h: 0.45, fontFace: BODY, fontSize: 12, italic: true, color: "CFE0E2", margin: 0, isTextBox: true });
  s.addNotes("Diese Folie ist nur die Arbeitsanleitung. Du kannst sie am Ende löschen.");
  return s;
}

async function landscapePng() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fb3d5"/><stop offset="1" stop-color="#f6e3c8"/></linearGradient></defs>
    <rect width="1600" height="900" fill="url(#sky)"/>
    <circle cx="1180" cy="260" r="110" fill="#f4c86a"/>
    <path d="M0 620 Q 300 470 620 600 T 1250 560 T 1600 600 V900 H0Z" fill="#8fbf9b"/>
    <path d="M0 720 Q 400 600 820 720 T 1600 690 V900 H0Z" fill="#5f8a6c"/>
    <path d="M760 900 Q 820 760 900 700 Q 960 660 1020 700 Q 940 780 980 900Z" fill="#6aa0c7"/>
    <g fill="#3d5e48"><path d="M260 700 l40 -140 l40 140z"/><path d="M330 710 l32 -110 l32 110z"/><path d="M1300 690 l45 -150 l45 150z"/></g>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// ---------------------------------------------------------------- E3
function e3() {
  const p = newDeck("Übung E3 – Textwüste");
  introSlide(p, "Modul E3 · Text gestalten", "Die Textwüste", [
    "Auf den nächsten zwei Folien steht viel zu viel Text – so wie in vielen echten Präsentationen.",
    "Verwandle jede Folie in höchstens 5 knappe Stichpunkte (Taste Tab für Unterpunkte).",
    "Räume die Formatierung auf: eine serifenlose Schrift, mindestens 24 pt, linksbündig, nichts unterstrichen.",
    "Hebe pro Folie höchstens ein Schlüsselwort mit Fett oder Farbe hervor.",
  ], "Vergleiche am Ende mit deiner Nachbarin/deinem Nachbarn: Wer hat es kürzer geschafft, ohne dass Wichtiges fehlt?");

  const bad = (s, title, text) => {
    s.addText(title, { x: 0.5, y: 0.3, w: 9, h: 0.8, fontFace: "Times New Roman", fontSize: 30, color: "1F4E79", underline: { style: "sng" }, align: "center", isTextBox: true });
    s.addText(text, { x: 0.5, y: 1.2, w: 9, h: 4.1, fontFace: "Times New Roman", fontSize: 15, color: "404040", align: "center", valign: "top", isTextBox: true });
  };
  bad(p.addSlide(), "GESUNDE ERNÄHRUNG IM ALLTAG",
    [{ text: "Eine ausgewogene Ernährung ist für unsere Gesundheit sehr wichtig, und deshalb sollte man darauf achten, jeden Tag ", options: {} },
     { text: "genug Obst und Gemüse", options: { underline: { style: "sng" } } },
     { text: " zu essen. Empfohlen werden oft fünf Portionen am Tag, wobei eine Portion ungefähr einer Handvoll entspricht. Außerdem ist es wichtig, ausreichend zu trinken, am besten Wasser oder ungesüßten Tee, und zwar etwa anderthalb Liter pro Tag. Vollkornprodukte sind besser als Weißmehl, weil sie länger satt machen und mehr Ballaststoffe enthalten. Zucker und stark verarbeitete Lebensmittel sollte man dagegen eher selten essen. Und nicht zuletzt spielt auch eine Rolle, dass man in Ruhe isst und sich Zeit für die Mahlzeiten nimmt, weil man dann besser merkt, wann man satt ist.", options: {} }]);
  bad(p.addSlide(), "Die Geschichte des Fahrrads",
    "Das Fahrrad hat eine lange Geschichte. Im Jahr 1817 stellte Karl Drais in Mannheim seine Laufmaschine vor, die noch keine Pedale hatte, sodass man sich mit den Füßen vom Boden abstoßen musste. In den 1860er-Jahren kamen dann Pedale hinzu, die direkt am Vorderrad befestigt waren. Später wurden Hochräder mit einem riesigen Vorderrad gebaut, die zwar schnell, aber auch ziemlich gefährlich waren, weil man leicht nach vorne stürzen konnte. In den 1880er-Jahren setzte sich dann das sogenannte Sicherheitsfahrrad mit zwei gleich großen Rädern und einem Kettenantrieb am Hinterrad durch, das unseren heutigen Fahrrädern schon sehr ähnlich war. Kurz darauf wurden auch luftgefüllte Reifen erfunden, die das Fahren deutlich bequemer machten.");
  return p.writeFile({ fileName: OUT + "e3-textwueste.pptx" });
}

// ---------------------------------------------------------------- F3
async function f3() {
  const p = newDeck("Übung F3 – Aufräumen");
  introSlide(p, "Modul F3 · Ausrichten, Anordnen, Gruppieren", "Aufräumen!", [
    "Folie 2: Die vier Kreise stehen chaotisch. Mach sie gleich groß, richte sie oben aus und verteile sie gleichmäßig. Gruppiere sie und zentriere die Gruppe auf der Folie.",
    "Folie 3: Die Bildunterschrift ist verschwunden – sie liegt hinter dem Bild. Bring die Ebenen in die richtige Reihenfolge: Bild hinten, halbtransparente Fläche darüber, Text ganz vorn. Dann alles gruppieren.",
    "Folie 4: Die drei Karten haben unterschiedliche Abstände. Richte sie aus und verteile sie gleichmäßig.",
  ], "Tipp: Mehrere Objekte markierst du mit gedrückter Umschalt-Taste.");

  // Folie 2: chaotische Kreise
  const s2 = p.addSlide();
  s2.addText("Was ein gutes Team ausmacht", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontFace: HEAD, fontSize: 30, color: C.deep, isTextBox: true });
  [["Vertrauen", 0.7, 1.5, 1.7], ["Kommunikation", 2.9, 2.6, 1.95], ["Gemeinsame Ziele", 5.2, 1.3, 1.6], ["Humor", 7.4, 2.2, 1.8]].forEach(([t, x, y, d]) => {
    s2.addText(t, { shape: p.ShapeType.ellipse, x, y, w: d, h: d, fill: { color: C.accent }, color: C.white, fontFace: BODY, fontSize: 14, bold: true, align: "center", valign: "middle", isTextBox: true });
  });

  // Folie 3: Ebenen falsch herum
  const s3 = p.addSlide();
  s3.addText("Unser Ausflugsziel", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontFace: HEAD, fontSize: 30, color: C.deep, isTextBox: true });
  s3.addText("Wanderung am Fluss – Treffpunkt 9 Uhr am Bahnhof", { x: 1.2, y: 4.2, w: 7.6, h: 0.6, fontFace: BODY, fontSize: 20, bold: true, color: C.white, isTextBox: true, objectName: "Bildunterschrift" });
  s3.addShape(p.ShapeType.rect, { x: 1.0, y: 4.1, w: 8.0, h: 0.8, fill: { color: "000000", transparency: 45 }, line: { type: "none" }, objectName: "Halbtransparente Fläche" });
  s3.addImage({ data: await landscapePng(), x: 1.0, y: 1.1, w: 8.0, h: 4.0, objectName: "Landschaftsbild" });

  // Folie 4: ungleich verteilte Karten
  const s4 = p.addSlide();
  s4.addText("Drei Schritte zum Referat", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontFace: HEAD, fontSize: 30, color: C.deep, isTextBox: true });
  [["1  Thema eingrenzen", 0.5, 1.6], ["2  Recherchieren", 3.05, 1.85], ["3  Folien bauen", 6.9, 1.45]].forEach(([t, x, y]) => {
    s4.addText(t, { shape: p.ShapeType.roundRect, rectRadius: 0.12, x, y, w: 2.6, h: 2.2, fill: { color: C.sand }, line: { color: "D8CFBD", width: 1 }, color: C.ink, fontFace: BODY, fontSize: 18, bold: true, align: "center", valign: "middle", isTextBox: true });
  });
  return p.writeFile({ fileName: OUT + "f3-aufraeumen.pptx" });
}

// ---------------------------------------------------------------- F4
function f4() {
  const p = newDeck("Übung F4 – Diagramm verbessern");
  introSlide(p, "Modul F4 · Tabellen & Diagramme", "Mach das Diagramm besser", [
    "Folie 2 zeigt die Daten einer Umfrage als Tabelle.",
    "Auf Folie 3 ist daraus ein Diagramm geworden – aber ein schlechtes: nichtssagender Titel, Legende überflüssig, keine Zahlen am Diagramm.",
    "Verbessere es: Aussage-Überschrift, Datenbeschriftungen an, Legende aus, wichtigste Säule in der Akzentfarbe, Rest grau.",
    "Plus: Würde ein anderer Diagrammtyp besser passen? Probier ein Kreisdiagramm und entscheide dich.",
  ], "Die Zahlen sind ausgedacht (Beispielklasse mit 24 Personen).");

  const s2 = p.addSlide();
  s2.addText("Umfrage: Wie kommst du zur Schule?", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontFace: HEAD, fontSize: 30, color: C.deep, isTextBox: true });
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: C.deep } } });
  s2.addTable([[hdr("Verkehrsmittel"), hdr("Anzahl")], ["Bus", "12"], ["Fahrrad", "5"], ["zu Fuß", "4"], ["Auto (gebracht)", "3"]],
    { x: 2.5, y: 1.3, w: 5, colW: [3.2, 1.8], fontFace: BODY, fontSize: 18, color: C.ink, border: { type: "solid", pt: 1, color: "D8CFBD" }, rowH: 0.55 });

  const s3 = p.addSlide();
  s3.addText("Diagramm", { x: 0.5, y: 0.3, w: 9, h: 0.7, fontFace: BODY, fontSize: 28, color: "000000", isTextBox: true });
  s3.addChart(p.ChartType.bar, [
    { name: "Bus", labels: ["Anzahl"], values: [12] }, { name: "Fahrrad", labels: ["Anzahl"], values: [5] },
    { name: "zu Fuß", labels: ["Anzahl"], values: [4] }, { name: "Auto", labels: ["Anzahl"], values: [3] },
  ], { x: 0.8, y: 1.1, w: 8.4, h: 4.2, barDir: "col", showLegend: true, legendPos: "r", chartColors: ["4472C4", "ED7D31", "A5A5A5", "FFC000"] });
  s3.addNotes("Absichtlich schlecht: Jede Säule ist eine eigene Datenreihe, deshalb braucht es eine Legende. Besser: eine Datenreihe mit den Verkehrsmitteln als Kategorien (Daten bearbeiten).");
  return p.writeFile({ fileName: OUT + "f4-diagramm-verbessern.pptx" });
}

// ---------------------------------------------------------------- P2
function p2() {
  const p = newDeck("Übung P2 – Morphen");
  introSlide(p, "Modul P2 · Morphen", "Morph-Werkstatt", [
    "Folie 2 und 3 zeigen denselben kleinen Stadtplan – einmal im Überblick, einmal herangezoomt auf die Schule.",
    "Gib Folie 3 den Übergang Morphen (Registerkarte Übergänge) und schau dir die Vorschau an.",
    "Folie 4 und 5: Die Kugel soll wandern und wachsen. Gib Folie 5 den Übergang Morphen.",
    "Plus: Füge eine Folie 6 hinzu, die auf den Bahnhof zoomt (Folie 2 duplizieren, alles vergrößern und verschieben).",
  ], "Alle Objekte haben schon passende Namen – so erkennt das Programm sie auf beiden Folien wieder.");

  // Stadtplan aus Formen: [name, typ, x, y, w, h, farbe, text]
  const plan = [
    ["Fluss", "rect", 0, 3.6, 10, 0.55, "8EC0DE", ""],
    ["Park", "roundRect", 0.6, 1.2, 2.4, 1.7, "8FBF9B", "Park"],
    ["Schule", "rect", 4.0, 1.3, 1.6, 1.2, C.accent, "Schule"],
    ["Bäckerei", "rect", 6.3, 1.5, 1.1, 0.8, "E2B34A", "Bäckerei"],
    ["Bahnhof", "rect", 7.6, 4.4, 1.8, 0.8, C.deep, "Bahnhof"],
    ["Straße", "rect", 3.5, 0.9, 0.25, 4.7, "BFB6A4", ""],
    ["Sporthalle", "rect", 4.0, 2.65, 1.2, 0.7, "C9896B", "Halle"],
  ];
  const drawPlan = (s, zoom, cx, cy, title) => {
    // Transformation: Punkt (cx,cy) in die Folienmitte, Faktor zoom
    const T = (x, y) => [5 + (x - cx) * zoom, 3.1 + (y - cy) * zoom];
    plan.forEach(([name, typ, x, y, w, h, fill, text]) => {
      const [nx, ny] = T(x, y);
      const opt = { x: nx, y: ny, w: w * zoom, h: h * zoom, fill: { color: fill }, line: { type: "none" }, objectName: "!!" + name };
      if (typ === "roundRect") opt.rectRadius = 0.15 * zoom;
      if (text) s.addText(text, Object.assign(opt, { shape: typ === "roundRect" ? p.ShapeType.roundRect : p.ShapeType.rect, fontFace: BODY, fontSize: 12 * zoom, bold: true, color: C.white, align: "center", valign: "middle", isTextBox: true }));
      else s.addShape(typ === "roundRect" ? p.ShapeType.roundRect : p.ShapeType.rect, opt);
    });
    s.addText(title, { x: 0.4, y: 0.2, w: 6, h: 0.6, fontFace: HEAD, fontSize: 26, color: C.deep, fill: { color: C.white, transparency: 15 }, objectName: "Titel", isTextBox: true });
  };
  drawPlan(p.addSlide(), 1, 5, 3.1, "Der Überblick");
  drawPlan(p.addSlide(), 2.6, 4.8, 1.9, "Das Detail: unsere Schule");

  const k1 = p.addSlide();
  k1.addText("Die wandernde Kugel", { x: 0.4, y: 0.2, w: 6, h: 0.6, fontFace: HEAD, fontSize: 26, color: C.deep, objectName: "Titel", isTextBox: true });
  k1.addShape(p.ShapeType.ellipse, { x: 0.8, y: 4.0, w: 0.8, h: 0.8, fill: { color: C.accent }, line: { type: "none" }, objectName: "!!Kugel" });
  const k2 = p.addSlide();
  k2.addText("Die wandernde Kugel", { x: 0.4, y: 0.2, w: 6, h: 0.6, fontFace: HEAD, fontSize: 26, color: C.deep, objectName: "Titel", isTextBox: true });
  k2.addShape(p.ShapeType.ellipse, { x: 6.6, y: 1.2, w: 2.2, h: 2.2, fill: { color: C.green }, line: { type: "none" }, objectName: "!!Kugel" });
  return p.writeFile({ fileName: OUT + "p2-morph-werkstatt.pptx" });
}

// ---------------------------------------------------------------- P3
function p3() {
  const p = newDeck("Übung P3 – Quiz-Gerüst");
  // Folienreihenfolge: 1 Anleitung, 2 Start, 3 F1, 4 Falsch1, 5 F2, 6 Falsch2, 7 F3, 8 Falsch3, 9 Ende
  introSlide(p, "Modul P3 · Interaktiv", "Quiz-Gerüst", [
    "Frage 1 ist fertig verlinkt: Die richtige Antwort springt zu Frage 2, falsche Antworten zu „Leider falsch“ und von dort zurück. Probier es in der Bildschirmpräsentation aus.",
    "Setze die Links für Frage 2 und 3 genauso (Antwort markieren › Strg+K › Folie in dieser Präsentation).",
    "Schalte das Weiterklicken ab (PowerPoint: Kiosk-Modus, OnlyOffice: „Bei Klicken beginnen“ aus) und lass jemanden das Quiz spielen.",
    "Kreativ: Ersetze die Fragen durch eigene zu einem Thema deiner Wahl.",
  ], "Welche Antwort richtig ist, steht in den Notizen jeder Frage.");

  const btn = (s, text, x, y, w, target, fill) => {
    const o = { shape: p.ShapeType.roundRect, rectRadius: 0.12, x, y, w, h: 0.75, fill: { color: fill || C.deep }, line: { type: "none" }, fontFace: BODY, fontSize: 18, bold: true, color: C.white, align: "center", valign: "middle", isTextBox: true, objectName: "Button " + text.slice(0, 20) };
    if (target) s.addText([{ text, options: { hyperlink: { slide: target, tooltip: text } } }], o);
    else s.addText(text, o);
  };
  const title = (s, t, color) => s.addText(t, { x: 0.6, y: 0.4, w: 8.8, h: 1.2, fontFace: HEAD, fontSize: 30, color: color || C.deep, valign: "top", margin: 0, isTextBox: true });

  const start = p.addSlide(); start.background = { color: C.deep };
  title(start, "Quiz: Gute Folien", C.white);
  start.addText("Drei Fragen – schaffst du alle beim ersten Versuch?", { x: 0.6, y: 1.5, w: 8.8, h: 0.6, fontFace: BODY, fontSize: 20, color: "CFE0E2", margin: 0, isTextBox: true });
  btn(start, "Quiz starten →", 0.6, 3.2, 3.2, 3, C.accent);

  const fragen = [
    { q: "Wie viele Stichpunkte sollten höchstens auf einer Folie stehen?", a: ["ungefähr 6", "12", "so viele wie nötig"], right: 0 },
    { q: "Welcher Diagrammtyp zeigt eine Entwicklung über die Zeit?", a: ["Kreisdiagramm", "Liniendiagramm", "3D-Säulendiagramm"], right: 1 },
    { q: "Wie hebst du ein Wort am besten hervor?", a: ["Unterstreichen", "GROSSBUCHSTABEN", "Fett oder eine Akzentfarbe"], right: 2 },
  ];
  fragen.forEach((f, i) => {
    const fSlide = 3 + i * 2, falsch = fSlide + 1, next = i < 2 ? fSlide + 2 : 9;
    const linked = i === 0;
    const s = p.addSlide();
    s.addText(`Frage ${i + 1} von 3`, { x: 0.6, y: 0.25, w: 4, h: 0.35, fontFace: BODY, fontSize: 14, bold: true, color: C.accent, margin: 0, isTextBox: true });
    title(s, f.q);
    s.addText("Klicke auf die richtige Antwort.", { x: 0.6, y: 1.65, w: 8.8, h: 0.4, fontFace: BODY, fontSize: 15, italic: true, color: C.muted, margin: 0, isTextBox: true });
    f.a.forEach((a, j) => btn(s, a, 0.6, 2.25 + j * 0.95, 5.5, linked ? (j === f.right ? next : falsch) : null));
    s.addNotes(`Richtig ist: „${f.a[f.right]}“.` + (linked ? " Diese Frage ist schon verlinkt." : ` Links setzen: richtige Antwort → Folie ${next}, falsche Antworten → Folie ${falsch}.`));

    const w = p.addSlide(); w.background = { color: "F8E1DC" };
    title(w, "Leider falsch …", "B8402F");
    w.addText("Kein Problem – schau dir die Frage noch einmal an.", { x: 0.6, y: 1.5, w: 8.8, h: 0.6, fontFace: BODY, fontSize: 20, color: C.ink, margin: 0, isTextBox: true });
    btn(w, "← Nochmal versuchen", 0.6, 3.2, 3.8, linked ? fSlide : null, "B8402F");
    if (!linked) w.addNotes(`Link setzen: „Nochmal versuchen“ → Folie ${fSlide}.`);
  });

  const end = p.addSlide(); end.background = { color: C.green };
  title(end, "Geschafft!", C.white);
  end.addText("Du kennst die wichtigsten Regeln für gute Folien.", { x: 0.6, y: 1.5, w: 8.8, h: 0.6, fontFace: BODY, fontSize: 20, color: C.white, margin: 0, isTextBox: true });
  btn(end, "Zurück zum Start", 0.6, 3.2, 3.4, null, C.deep);
  end.addNotes("Link setzen: „Zurück zum Start“ → Folie 2.");
  return p.writeFile({ fileName: OUT + "p3-quiz-geruest.pptx" });
}

(async () => {
  require("fs").mkdirSync(OUT, { recursive: true });
  for (const f of [e3, f3, f4, p2, p3]) console.log(await f());
})();
