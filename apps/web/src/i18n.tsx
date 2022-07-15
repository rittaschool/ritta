import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(Backend)
  .use(LanguageDetector)
  .init({
    load: "languageOnly",
    supportedLngs: ["fi", "en"],

    ns: ["common", "navigation", "auth", "messages"],

    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },

    detection: {
      order: ["querystring", "sessionStorage", "localStorage", "navigator"],
    },
  });

export default i18n;
