import React, { useContext, useState, useRef } from "react";
import { TranslateContext } from "../../context/TranslateProvider";

const languages = [
  { code: "en", label: "New Zealand", flag: "https://flagcdn.com/w40/nz.png" },
  { code: "en", label: "Australia", flag: "https://flagcdn.com/w40/au.png" },
  { code: "en", label: "United Kingdom", flag: "https://flagcdn.com/w40/gb.png" },
  { code: "en", label: "United States (English)", flag: "https://flagcdn.com/w40/us.png" },
  { code: "fr", label: "Canada", flag: "https://flagcdn.com/w40/ca.png" },
  { code: "fr", label: "France", flag: "https://flagcdn.com/w40/fr.png" },
  { code: "de", label: "Germany", flag: "https://flagcdn.com/w40/de.png" },
  { code: "it", label: "Italy", flag: "https://flagcdn.com/w40/it.png" },
  { code: "nl", label: "Netherlands", flag: "https://flagcdn.com/w40/nl.png" },
  { code: "es", label: "Spain", flag: "https://flagcdn.com/w40/es.png" },
  { code: "es", label: "United States (Español)", flag: "https://flagcdn.com/w40/us.png" },
  { code: "fr", label: "United States (Français)", flag: "https://flagcdn.com/w40/us.png" },
];


const GoogleTranslateDropdown = () => {
  const { selectedLang, setSelectedLang } = useContext(TranslateContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (lang) => {
    document.cookie = `googtrans=/en/${lang.code}; path=/; domain=${window.location.hostname}`;
    localStorage.setItem("bluelink_selected_lang", lang.label);
    setSelectedLang(lang.label);
    setOpen(false);
  };

  const current = languages.find((l) => l.label === selectedLang) || languages[0];

  return (
    <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
      >
        <img src={current.flag} alt="" style={{ width: "20px" }} />
        <span>{current.label}</span>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            borderRadius: "6px",
            padding: "8px 0",
            minWidth: "250px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {languages.map((lang, index) => (
            <div
              key={index}
              onClick={() => handleSelect(lang)}
              style={{
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: lang.label === selectedLang ? "#f0f0f0" : "transparent",
              }}
            >
              <img src={lang.flag} alt={lang.label} style={{ width: "20px", marginRight: "10px" }} />
              <span>{lang.label}</span>
              {lang.label === selectedLang && (
                <span style={{ marginLeft: "auto", color: "green" }}>✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoogleTranslateDropdown;
