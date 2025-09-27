// src/components/AddressAutocomplete.jsx
import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../../../config";

/**
 * AddressAutocomplete (no auto-save)
 *
 * - Fetches suggestions from `${API_BASE_URL}/geo/autocomplete`
 * - On select: populates address, city, region, postalCode, country in newAddress
 * - Does NOT call the backend save endpoint (save should be handled by the parent form)
 *
 * Props:
 *  - newAddress: object state for the address
 *  - setNewAddress: setter for newAddress
 *  - countryBias (optional)
 */
export default function AddressAutocomplete({
  newAddress,
  setNewAddress,
  countryBias,
}) {
  const [q, setQ] = useState(newAddress?.address || "");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef(null);
  const activeReqRef = useRef(null);

  useEffect(() => {
    setQ(newAddress?.address || "");
  }, [newAddress?.address]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (activeReqRef.current && typeof activeReqRef.current.abort === "function") {
        activeReqRef.current.abort();
      }
    };
  }, []);

  async function fetchPredictions(input) {
    if (!input || input.length < 2) {
      setPredictions([]);
      return;
    }
    setLoading(true);
    setError("");
    const ctrl = new AbortController();
    activeReqRef.current = ctrl;

    try {
      const url = `${API_BASE_URL}/geo/autocomplete?q=${encodeURIComponent(input)}${countryBias ? `&country=${encodeURIComponent(countryBias)}` : ""}`;
      const res = await fetch(url, { signal: ctrl.signal, credentials: "include" });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Geo error ${res.status} ${txt}`);
      }
      const json = await res.json();
      setPredictions(json.results || []);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("autocomplete fetch error", err);
      setError("Failed to fetch address suggestions");
      setPredictions([]);
    } finally {
      setLoading(false);
      activeReqRef.current = null;
    }
  }

  const onChange = (e) => {
    const value = e.target.value;
    setQ(value);
    // update typed address text only
    setNewAddress((s) => ({ ...s, address: value }));

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchPredictions(value), 300);
  };

  // Helper — optionally reverse geocode for missing components (light)
  async function reverseGeocodeIfNeeded(lat, lon) {
    if (!lat || !lon) return null;
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&addressdetails=1`;
      const res = await fetch(url, {
        headers: { "User-Agent": "BlueLinkPrinting/1.0 (contact: support@yourdomain.com)" },
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.address || null;
    } catch (err) {
      console.warn("reverseGeocode error", err);
      return null;
    }
  }

  // Choose sensible fields from a geocoder item and optionally reverse geocode to fill gaps
  async function buildAddressFromItem(item) {
    const addr = item.address || {};
    const street = addr.street || "";
    const housenumber = addr.housenumber || "";
    const combined = [housenumber, street].filter(Boolean).join(" ").trim() || item.display_name || addr.name || "";

    let city = addr.city || addr.town || addr.village || "";
    let region = addr.state || "";
    let postcode = addr.postcode || "";
    const country = addr.country || "";

    // If city/region/postcode missing, try reverse geocode once
    if ((!city || !region || !postcode) && item.lat && item.lon) {
      const more = await reverseGeocodeIfNeeded(item.lat, item.lon);
      if (more) {
        city = city || more.city || more.town || more.village || more.county || city;
        region = region || more.state || more.county || region;
        postcode = postcode || more.postcode || postcode;
      }
    }

    return {
      address: combined,
      city: city || "",
      region: region || "",
      postalCode: postcode || "",
      country: country || "",
      // keep lat/lon locally if you want to persist later (but we won't send them automatically)
      geometry: item.lat && item.lon ? { lat: item.lat, lng: item.lon } : null,
    };
  }

  const onSelect = async (item) => {
    setError("");
    setPredictions([]);

    const filled = await buildAddressFromItem(item);

    // Update only the allowed fields; do NOT call backend here.
    setNewAddress((s) => ({
      ...s,
      address: filled.address,
      city: filled.city,
      region: filled.region,
      postalCode: filled.postalCode,
      country: filled.country || s.country || "New Zealand",
      // keep user's fullName/phone/addressType/isDefault untouched
      // store geometry locally if desired (parent can read newAddress.geometry)
      geometry: filled.geometry || s.geometry,
    }));

    setQ(filled.address);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Address</label>
      <input
        value={q}
        onChange={onChange}
        placeholder="Start typing street, suburb or city"
        style={{ padding: 12, borderRadius: 8, border: "1px solid #e5e7eb", width: "100%", outline: "none" }}
        aria-autocomplete="list"
        aria-controls="address-suggestions"
        aria-expanded={predictions.length > 0}
      />

      {loading && <div style={{ position: "absolute", right: 10, top: 12 }}>…</div>}
      {error && <div style={{ color: "crimson", marginTop: 6 }}>{error}</div>}

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
              key={p.id}
              onClick={() => onSelect(p)}
              role="option"
              style={{ padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}
            >
              <div style={{ fontWeight: 600 }}>{p.display_name}</div>
              {p.address && (
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {[p.address.city || p.address.town || p.address.village, p.address.state, p.address.country]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
