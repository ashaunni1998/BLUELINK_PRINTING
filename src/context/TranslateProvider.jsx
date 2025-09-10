import React, { createContext, useEffect, useState } from "react";

export const TranslateContext = createContext();

const languages = [
  { code: "en", label: "New Zealand" },
  { code: "en", label: "United Kingdom" },
  { code: "en", label: "United States (English)" },
  { code: "fr", label: "Canada" },
  { code: "fr", label: "France" },
  { code: "de", label: "Germany" },
  { code: "it", label: "Italy" },
  { code: "nl", label: "Netherlands" },
  { code: "es", label: "Spain" },
  { code: "es", label: "United States (Español)" },
  { code: "fr", label: "United States (Français)" },
];

export const TranslateProvider = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState("New Zealand");

  useEffect(() => {
    const savedLangLabel = localStorage.getItem("bluelink_selected_lang") || "New Zealand";
    setSelectedLang(savedLangLabel);

    const langObj = languages.find(l => l.label === savedLangLabel) || languages[0];

    document.cookie = `googtrans=/en/${langObj.code}; path=/; domain=${window.location.hostname}`;

    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,fr,de,it,nl,es",
            autoDisplay: false,
          },
          "hidden_translate_container"
        );
      };

      const script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const select = document.querySelector(".goog-te-combo");
      const langObj = languages.find((l) => l.label === selectedLang);

      if (select && langObj) {
        select.value = langObj.code;
        select.dispatchEvent(new Event("change"));
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [selectedLang]);

  return (
    <TranslateContext.Provider value={{ selectedLang, setSelectedLang }}>
      <div id="hidden_translate_container" style={{ display: "none" }}></div>
      {children}
    </TranslateContext.Provider>
  );
};
