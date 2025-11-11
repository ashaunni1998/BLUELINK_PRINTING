// src/main.jsx
import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./admin/redux/store.jsx";
import axios from "axios";
import { API_BASE_URL } from "./config";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL.replace(/\/$/, "");

const savedToken = localStorage.getItem("token");
if (savedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

// === Inject Tawk.to and Google Analytics scripts ===
const addExternalScripts = () => {
  // --- Tawk.to Script ---
  const tawk = document.createElement("script");
  tawk.async = true;
  tawk.src = "https://embed.tawk.to/690f30a6ee2732195b2fb4d1/1j9hlc3dv";
  tawk.charset = "UTF-8";
  tawk.setAttribute("crossorigin", "*");
  document.body.appendChild(tawk);

  // --- Google Tag (gtag.js) ---
  const gtagScript = document.createElement("script");
  gtagScript.async = true;
  gtagScript.src = "https://www.googletagmanager.com/gtag/js?id=G-PWE0B42ZE5";
  document.head.appendChild(gtagScript);

  // gtag config
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-PWE0B42ZE5");
};

// call it once after window loads
window.addEventListener("load", addExternalScripts);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
