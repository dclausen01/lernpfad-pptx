/* Zentrale Liste aller Videos und Hilfeseiten.
 *
 * Qualitätssicherung: Es werden nur offizielle Quellen verlinkt
 * (Microsoft Support / ONLYOFFICE Hilfe-Center / offizieller ONLYOFFICE-YouTube-Kanal).
 * Die Module verweisen nur über die ID auf einen Eintrag – ein Link muss
 * also nur hier geändert werden.
 *
 * Felder:
 *   app         "ppt" = PowerPoint 365, "oo" = OnlyOffice
 *   type        "video" | "kurs" (Microsoft-Kurzkurs mit mehreren Videos) | "hilfe" (Text + Bilder)
 *   lang        "de" | "en"
 *   linkGeprueft  Datum, an dem der Link zuletzt erreichbar war
 *   freigegeben   Datum + Kürzel, wenn eine Lehrkraft den Inhalt angesehen und freigegeben hat
 *
 * Wenn MEDIA_CONFIG.nurFreigegebene = true gesetzt wird, sehen Schüler:innen
 * nur noch Einträge mit ausgefülltem "freigegeben".
 */
window.MEDIA_CONFIG = { nurFreigegebene: false };

window.MEDIA = {
  /* ---------- Microsoft: PowerPoint-Schulung (Kurzkurse mit Videos, deutsch) ---------- */
  "ms-schnellstart": {
    app: "ppt", type: "kurs", lang: "de", source: "Microsoft Support",
    title: "PowerPoint-Schulung: Schnellstart",
    url: "https://support.microsoft.com/de-de/topic/422250f8-5721-4cea-92cc-202fa7b89617",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "ms-erste-schritte": {
    app: "ppt", type: "kurs", lang: "de", source: "Microsoft Support",
    title: "PowerPoint-Schulung: Erste Schritte",
    url: "https://support.microsoft.com/de-de/topic/5f9cc860-d199-4d85-ad1b-4b74018acf5b",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "ms-folien-layouts": {
    app: "ppt", type: "kurs", lang: "de", source: "Microsoft Support",
    title: "PowerPoint-Schulung: Folien und Layouts",
    url: "https://support.microsoft.com/de-de/topic/b9abb2a0-7aef-4257-a14e-4329c904da54",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "ms-text-folien": {
    app: "ppt", type: "kurs", lang: "de", source: "Microsoft Support",
    title: "PowerPoint-Schulung: Text & Folien",
    url: "https://support.microsoft.com/de-de/topic/6c206169-2b17-48c5-8bd9-df38fa6049d1",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "ms-bilder": {
    app: "ppt", type: "kurs", lang: "de", source: "Microsoft Support",
    title: "PowerPoint-Schulung: Bilder und Grafiken",
    url: "https://support.microsoft.com/de-de/topic/5f7368d2-ee94-4b94-a6f2-a663646a07e1",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "ms-vorfuehren": {
    app: "ppt", type: "kurs", lang: "de", source: "Microsoft Support",
    title: "PowerPoint-Schulung: Vorführen von Bildschirmpräsentationen",
    url: "https://support.microsoft.com/de-de/topic/4de90e28-487e-435c-9401-eb49a3801257",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "ms-animation": {
    app: "ppt", type: "kurs", lang: "de", source: "Microsoft Support",
    title: "PowerPoint-Schulung: Animation, Video und Audio",
    url: "https://support.microsoft.com/de-de/topic/3f8244bf-f893-4efd-a7eb-3a4845c9c971",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "ms-teilen": {
    app: "ppt", type: "kurs", lang: "de", source: "Microsoft Support",
    title: "PowerPoint-Schulung: Zusammenarbeiten & Teilen",
    url: "https://support.microsoft.com/de-de/topic/a2728f34-9a39-4af2-bc75-30edb9bc1cdd",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },

  /* ---------- Microsoft: einzelne Hilfeseiten (deutsch, teils mit Video) ---------- */
  "ms-designer": {
    app: "ppt", type: "hilfe", lang: "de", source: "Microsoft Support",
    title: "Professionelle Folienlayouts mit Designer erstellen",
    url: "https://support.microsoft.com/de-de/office/erstellen-professioneller-folienlayouts-mit-designer-53c77d7b-dc40-45c2-b684-81415eac0617",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "ms-hintergrund-entfernen": {
    app: "ppt", type: "hilfe", lang: "de", source: "Microsoft Support",
    title: "Den Hintergrund eines Bilds entfernen",
    url: "https://support.microsoft.com/de-de/office/entfernen-des-hintergrunds-eines-bilds-in-office-c0819a62-6844-4190-8d67-6fb1713a12bf",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "ms-referentenansicht": {
    app: "ppt", type: "hilfe", lang: "de", source: "Microsoft Support",
    title: "Präsentation starten und Notizen in der Referentenansicht anzeigen",
    url: "https://support.microsoft.com/de-de/office/starten-der-pr%C3%A4sentation-und-anzeigen-ihrer-notizen-in-der-referentenansicht-4de90e28-487e-435c-9401-eb49a3801257",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "ms-morphen": {
    app: "ppt", type: "hilfe", lang: "de", source: "Microsoft Support",
    title: "Den Übergang „Morphen“ verwenden",
    url: "https://support.microsoft.com/de-de/office/verwenden-des-%C3%BCbergangs-morphen-in-powerpoint-8dd1c7b2-b935-44f5-a74c-741d8d9244ea",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "ms-folienmaster": {
    app: "ppt", type: "hilfe", lang: "de", source: "Microsoft Support",
    title: "Anpassen eines Folienmasters (mit Video)",
    url: "https://support.microsoft.com/de-de/powerpoint/training/customize-a-slide-master",
    linkGeprueft: "", freigegeben: ""
  },
  "ms-zoom": {
    app: "ppt", type: "hilfe", lang: "de", source: "Microsoft Support",
    title: "Zoom für PowerPoint verwenden",
    url: "https://support.microsoft.com/de-de/office/verwenden-des-zooms-f%C3%BCr-powerpoint-um-ihre-pr%C3%A4sentation-zum-leben-zu-erwecken-9d6c58cd-2125-4d29-86b1-0097c7dc47d7",
    linkGeprueft: "", freigegeben: ""
  },
  "ms-trigger": {
    app: "ppt", type: "hilfe", lang: "de", source: "Microsoft Support",
    title: "Auslösen eines Animationseffekts (Trigger)",
    url: "https://support.microsoft.com/de-de/powerpoint/trigger-an-animation-effect",
    linkGeprueft: "", freigegeben: ""
  },
  "ms-alternativtext": {
    app: "ppt", type: "hilfe", lang: "de", source: "Microsoft Support",
    title: "Alternativtext zu Bildern, Formen und Diagrammen hinzufügen",
    url: "https://support.microsoft.com/de-de/office/hinzuf%C3%BCgen-von-alternativem-text-zu-einer-form-einem-bild-diagramm-einer-smartart-grafik-oder-einem-anderen-objekt-44989b2a-903c-4d9a-b742-6a75b451c669",
    linkGeprueft: "", freigegeben: ""
  },
  "ms-barrierefrei": {
    app: "ppt", type: "hilfe", lang: "de", source: "Microsoft Support",
    title: "Barrierefreie PowerPoint-Präsentationen gestalten",
    url: "https://support.microsoft.com/de-de/office/gestalten-barrierefreier-powerpoint-pr%C3%A4sentationen-f%C3%BCr-personen-mit-behinderungen-6f7772b2-2f33-4bd2-8ca7-dae3b2b3ef25",
    linkGeprueft: "", freigegeben: ""
  },

  /* ---------- ONLYOFFICE: offizielle Videos (englisch) ---------- */
  "oo-video-ueberblick": {
    app: "oo", type: "video", lang: "en", source: "ONLYOFFICE (YouTube)",
    title: "ONLYOFFICE Docs: Presentation Editor – Überblick",
    url: "https://www.youtube.com/watch?v=kxMwSea5Nw4",
    hint: "Englisch – Untertitel einschalten und auf „Deutsch“ übersetzen lassen.",
    linkGeprueft: "", freigegeben: ""
  },

  /* ---------- ONLYOFFICE: Hilfe-Center (deutsch, mit Bildern) ---------- */
  "oo-oberflaeche": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Die Benutzeroberfläche des Präsentationseditors",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/ProgramInterface.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-folien": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Folien verwalten (hinzufügen, duplizieren, verschieben, Layout)",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/ManageSlides.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-design": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Thema, Farbschema, Foliengröße und Hintergrund",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/SetSlideParameters.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-bilder": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Bilder einfügen und anpassen",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/InsertImages.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-formen": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "AutoFormen einfügen und formatieren",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/InsertAutoshapes.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-praesentieren": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Bildschirmpräsentation und Referentenansicht",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/PreviewPresentation.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-speichern": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Speichern, herunterladen, drucken",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/SavePrintDownload.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-uebergaenge": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Folienübergänge anwenden (auch Morphen)",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/ApplyTransitions.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-animationen": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Animationen hinzufügen",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/AddingAnimations.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-ausrichten": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Objekte ausrichten und anordnen",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/AlignArrangeObjects.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-tabellen": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Tabellen einfügen und formatieren",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/InsertTables.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-diagramme": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Diagramme einfügen und bearbeiten",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/InsertCharts.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-smartart": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "SmartArt-Objekte einfügen",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/InsertSmartArt.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-links": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Hyperlinks hinzufügen",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/AddHyperlinks.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-fusszeile": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Fußzeilen, Datum und Foliennummern einfügen",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/InsertHeadersFooters.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-folienmaster": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Folienmaster verwenden",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/SlideMaster.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  },
  "oo-tastenkuerzel": {
    app: "oo", type: "hilfe", lang: "de", source: "ONLYOFFICE Hilfe-Center",
    title: "Tastenkombinationen",
    url: "https://helpcenter.onlyoffice.com/de/docs/userguides/presentation_editor/KeyboardShortcuts.aspx",
    linkGeprueft: "2026-09-28", freigegeben: ""
  }
};
