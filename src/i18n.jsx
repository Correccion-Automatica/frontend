import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es", // si el idioma del navegador no está en supportedLngs → usa español
    supportedLngs: ["es", "en"],
    debug: false,
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false, // evita parpadeo
    },
    resources: {
      es: {
        translation: {
          brand: "Automatic Correction",
          nav: { home: "Inicio", about: "Nosotros", pricing: "Precios", contact: "Contacto" },
          auth: { login: "Iniciar sesión", logout: "Cerrar sesión", welcome: "Hola, {{name}}", user: "Usuario" },
          a11y: { openMenu: "Abrir menú" },
        },
      },
      en: {
        translation: {
          brand: "Automatic Correction",
          nav: { home: "Home", about: "About", pricing: "Pricing", contact: "Contact" },
          auth: { login: "Log in", logout: "Log out", welcome: "Hi, {{name}}", user: "User" },
          a11y: { openMenu: "Open menu" },
        },
      },
    },
  });

export default i18n;
