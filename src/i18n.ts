import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

export const resources = {
  en: {
    translation: {
      "New pattern": "New pattern",
      Patterns: "Patterns",
      "New name": "New name",
      Save: "save",
      "Background image url": "Background image url",
      "Background image": "Background image",
      Scale: "Scale",
      Guides: "Guides",
      gcode: "gcode",
      Generate: "Generate",
    },
  },
  es: {
    translation: {
      "New pattern": "Nuevo patron",
      Patterns: "Patrones",
      "New name": "Nuevo nombre",
      Save: "Guardar",
      "Background image url": "url para imagen de fondo",
      "Background image": "Imagen de fondo",
      Scale: "Escala",
      Guides: "Guias",
      gcode: "gcode",
      Generate: "Generar",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ["navigator", "htmlTag"],
    },
  });
