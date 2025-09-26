// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./admin/redux/store.jsx";

import axios from "axios";
import { API_BASE_URL } from "./config";

// === Single global config change that fixes cookie sending ===
// Ensure axios sends cookies (and credential headers) on cross-origin requests
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE_URL.replace(/\/$/, "");

// Optional fallback: if your login stored a token in localStorage, rehydrate it
const savedToken = localStorage.getItem("token");
if (savedToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

// Wrap app with redux store and render
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
