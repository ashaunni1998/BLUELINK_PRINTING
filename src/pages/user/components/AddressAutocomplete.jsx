// src/components/AddressAutocomplete.jsx
import React, { useEffect, useRef, useState } from "react";
import { REACT_APP_GMAPS_KEY } from "../../../config";

const PROVIDED_KEY = REACT_APP_GMAPS_KEY || "AIzaSyAAbaLzcUYc-Mhgj6crbVaA7o1v35GNGhg";

/**
 * Loads Google Maps JS with Places library (idempotent).
 * Returns a Promise that resolves when window.google.maps.places is available.
 */
function loadGMapsScript(apiKey, id = "google-maps-places") {
  if (!apiKey) return Promise.reject(new Error("Missing Google Maps API key"));
  if (typeof window !== "undefined" && window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve();
  }

  const existing = document.getElementById(id);
  if (existing) {
    // If script tag already in DOM, wait for load/error events
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Google Maps script failed to load")));
    });
  }

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.defer = true;
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  document.head.appendChild(script);

  return new Promise((resolve, reject) => {
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps script"));
  });
}

/**
 * AddressAutocomplete component
 *
 * Props:
 *  - newAddress: object state for the new address
 *  - setNewAddress: setter for newAddress
 *  - countryBias (optional): 2-letter country code string to bias results (e.g. 'nz' or 'au')
 */
export default function AddressAutocomplete({ newAddress, setNewAddress, countryBias }) {
  const [predictions, setPredictions] = useState([]);
  const tokenRef = useRef(null);
  const serviceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const inputRef = useRef(null);

  // pick the key from config (PROVIDED_KEY) — fallback tries process.env (safe-read)
  const envKey =
    PROVIDED_KEY ||
    (typeof process !== "undefined" && process?.env?.REACT_APP_GMAPS_KEY) ||
    (typeof window !== "undefined" && window.__REACT_APP_GMAPS_KEY) || // optional runtime test fallback
    "";

  useEffect(() => {
    let mounted = true;
    if (!envKey) {
      console.warn(
        "AddressAutocomplete: Google Maps API key not found. Please set REACT_APP_GMAPS_KEY in src/config.js or .env."
      );
      return;
    }

    loadGMapsScript(envKey)
      .then(() => {
        if (!mounted) return;
        try {
          tokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
          serviceRef.current = new window.google.maps.places.AutocompleteService();
          // PlacesService requires a DOM node — we create a detached div
          placesServiceRef.current = new window.google.maps.places.PlacesService(document.createElement("div"));
        } catch (err) {
          console.error("AddressAutocomplete: failed initializing Google Places services:", err);
        }
      })
      .catch((err) => {
        console.error("AddressAutocomplete: failed loading Google Maps script:", err);
      });

    return () => {
      mounted = false;
    };
  }, [envKey]);

  const handleChange = (e) => {
    const value = e.target.value;
    setNewAddress((s) => ({ ...s, address: value }));

    if (!value || value.length < 2 || !serviceRef.current) {
      setPredictions([]);
      return;
    }

    const request = {
      input: value,
      sessionToken: tokenRef.current,
      componentRestrictions: countryBias ? { country: countryBias } : undefined,
      // types: ["address"] // optionally restrict to address results
    };

    try {
      serviceRef.current.getPlacePredictions(request, (preds, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !preds) {
          setPredictions([]);
          return;
        }
        setPredictions(preds);
      });
    } catch (err) {
      console.error("AddressAutocomplete: getPlacePredictions failed:", err);
      setPredictions([]);
    }
  };

  const handleSelect = (prediction) => {
    if (!placesServiceRef.current) {
      // fallback: set description only
      setNewAddress((s) => ({ ...s, address: prediction.description }));
      setPredictions([]);
      return;
    }

    placesServiceRef.current.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["address_components", "formatted_address", "geometry", "name"],
      },
      (place, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place) {
          setNewAddress((s) => ({ ...s, address: prediction.description }));
          setPredictions([]);
          return;
        }

        const ac = place.address_components || [];
        const find = (type) => {
          const c = ac.find((x) => x.types.indexOf(type) !== -1);
          return c ? c.long_name : "";
        };

        const streetNumber = find("street_number");
        const route = find("route");
        const locality = find("locality") || find("postal_town") || find("sublocality") || "";
        const city = locality || find("administrative_area_level_2") || find("administrative_area_level_1") || "";
        const region = find("administrative_area_level_1") || "";
        const postalCode = find("postal_code") || "";
        const country = find("country") || newAddress.country || "";

        const combined = [streetNumber, route].filter(Boolean).join(" ").trim() || place.formatted_address || prediction.description;

        setNewAddress((s) => ({
          ...s,
          address: combined,
          city: city || s.city || "",
          region: region || s.region || "",
          postalCode: postalCode || s.postalCode || "",
          country: country || s.country || "New Zealand",
          geometry: place.geometry ? { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() } : s.geometry,
        }));

        // safe new token for next session
        try {
          tokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
        } catch (err) {
          // not critical
        }
        setPredictions([]);
      }
    );
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Address</label>
      <input
        ref={inputRef}
        value={newAddress.address || ""}
        onChange={handleChange}
        placeholder="Start typing street, suburb or city (e.g. Grey Street, Hamilton)"
        style={{ padding: 12, borderRadius: 8, border: "1px solid #e5e7eb", width: "100%", outline: "none" }}
        aria-autocomplete="list"
        aria-controls="address-suggestions"
        aria-expanded={predictions.length > 0}
      />

      {predictions.length > 0 && (
        <ul
          id="address-suggestions"
          role="listbox"
          style={{
            position: "absolute",
            zIndex: 999999,
            left: 0,
            right: 0,
            marginTop: 6,
            maxHeight: 260,
            overflowY: "auto",
            background: "#fff",
            boxShadow: "0 6px 18px rgba(15,23,42,0.08)",
            border: "1px solid #e6eefc",
            borderRadius: 8,
            padding: 6,
            listStyle: "none",
          }}
        >
          {predictions.map((p) => (
            <li
              key={p.place_id}
              onClick={() => handleSelect(p)}
              role="option"
              style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
            >
              <div style={{ fontWeight: 600 }}>{p.description}</div>
              {p.structured_formatting?.secondary_text && (
                <div style={{ fontSize: 12, color: "#6b7280" }}>{p.structured_formatting.secondary_text}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
