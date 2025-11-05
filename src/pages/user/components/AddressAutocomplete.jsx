    import React, { useEffect, useRef, useState } from "react";
    // 1. UPDATED: Changed import path to match AccountPage.jsx
    import { API_BASE_URL } from "../../../config";

    /**
     * AddressAutocomplete (no auto-save)
     *
     * - Fetches suggestions from `${API_BASE_URL}/geo/autocomplete`
     * - On select: populates address, city, region, postalCode, country in newAddress
     * - Does NOT call the backend save endpoint (save should be handled by the parent form)
     *
     * Props:
     * - newAddress: object state for the address
     * - setNewAddress: setter for newAddress
     * - countryBias (optional)
     * - style (optional): Applied to the input element
     */
    export default function AddressAutocomplete({
      newAddress,
      setNewAddress,
      countryBias,
      style, // 2. ADDED: Accept style prop
    }) {
      const [q, setQ] = useState(newAddress?.address || "");
      const [predictions, setPredictions] = useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
      const timerRef = useRef(null);
      const activeReqRef = useRef(null);

      const numberFromInput = (s = "") => {
    const m = String(s).match(/^\s*(\d+[A-Za-z]?)\b/);
    return m ? m[1] : "";
  };

  // Nice title-case for street names
  const titleCase = (s = "") =>
    s.replace(/\b\w+/g, t => t[0].toUpperCase() + t.slice(1).toLowerCase());
const countryName = (newAddress?.country || "").toLowerCase();
const allowAuto = countryName === "new zealand" || countryName === "australia";
const countryCode = countryName === "australia" ? "au" : "nz";

useEffect(() => {
  if (!allowAuto) setPredictions([]);
}, [allowAuto]);
// If country is not NZ, make sure suggestions are cleared

      useEffect(() => {
        // Only update query if the address text itself has changed
        // This prevents the selection from being overwritten
        if (newAddress?.address !== q) {
          setQ(newAddress?.address || "");
        }
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
    if (!input || input.trim().length < 1) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    setError("");
    const ctrl = new AbortController();
    activeReqRef.current = ctrl;

    try {
      // Pass current city/region (if user already filled them) to help ranking
      const cityHint   = (newAddress?.city   || "").trim();
      const regionHint = (newAddress?.region || "").trim();

      const url = `${API_BASE_URL}/geo/autocomplete` +
  `?q=${encodeURIComponent(input)}` +
  `&country=${encodeURIComponent(countryCode)}` +
  (cityHint   ? `&city=${encodeURIComponent(cityHint)}`     : "") +
  (regionHint ? `&region=${encodeURIComponent(regionHint)}` : "");


      const res = await fetch(url, { signal: ctrl.signal, credentials: "include" });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Geo error ${res.status} ${txt}`);
      }

      const json = await res.json();
      setPredictions(json.results || []);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("autocomplete fetch error", err);
        setError("Failed to fetch address suggestions");
        setPredictions([]);
      }
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

  // Only run autocomplete when country is New Zealand
  if (!allowAuto) {
  if (timerRef.current) clearTimeout(timerRef.current);
  setPredictions([]);
  return;
}

  if (timerRef.current) clearTimeout(timerRef.current);
  timerRef.current = setTimeout(() => fetchPredictions(value), 300);
};

// Helper — reverse geocode via *your* backend so postcode is normalized
async function reverseGeocodeIfNeeded(lat, lon) {
  if (!lat || !lon) return null;
  try {
    const url = `${API_BASE_URL}/geo/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.address || null; // { city, suburb, state, postcode, ... }
  } catch {
    return null;
  }
}


      
async function buildAddressFromItem(item, typed) {
  const addr = item.address || {};

  // Try to keep user's typed house number if API missed it
  const typedNo = (typed || '').match(/^\s*(\d+[A-Za-z]?)/)?.[1] || '';

  // Street name: prefer API street; else strip number from display_name head
  let street =
    (addr.street || ((item.display_name || '').split(',')[0] || '')
      .replace(/^\s*\d+[A-Za-z]?\s+/, '')).trim();

  // Title-case street a little
  street = street.replace(/\b\w+/g, t => t[0].toUpperCase() + t.slice(1).toLowerCase());

  const housenumber = (addr.housenumber || typedNo || '').trim();
  const addressLine = [housenumber, street].filter(Boolean).join(' ').replace(/\s+/g, ' ');

  // ALWAYS reverse to lock correct NZ suburb + postcode (e.g., 3216)
  let more = null;
  if (item.lat && item.lon) {
    more = await reverseGeocodeIfNeeded(item.lat, item.lon);
  }

  const city =
    (more?.city || more?.town || more?.village || addr.city || addr.town || addr.village || '') || '';
  const suburb =
    (more?.suburb || more?.neighbourhood || more?.city_district || addr.suburb || '') || '';
  const region =
    (more?.state || addr.state || '') || '';
  const postalCode =
    (more?.postcode || addr.postcode || '') || '';
 const country =
  countryCode === "au" ? "Australia" : "New Zealand";

  return {
    // Keep input field clean: "242 Grey Street"
    address: addressLine,
    city,
    region,
    postalCode,        // <- AA-style suburb postcode (e.g., 3216)
    country,
    suburb,            // keep if you later add a field for it
    geometry: (item.lat && item.lon) ? { lat: item.lat, lng: item.lon } : null,
  };
}
  const onSelect = async (item) => {
    setError("");
    setPredictions([]);

    const filled = await buildAddressFromItem(item, q); // <-- pass q here

    setNewAddress((s) => ({
      ...s,
      address: filled.address,
      city: filled.city,
      region: filled.region,
      postalCode: filled.postalCode,
      country: filled.country || s.country || "New Zealand",
      geometry: filled.geometry || s.geometry,
    }));

    setQ(filled.address);
  };
function strongPrefixMatch(input, item) {
  if (!item || !item.address) return false;

  const norm = (s = "") =>
    s
      .toLowerCase()
      .replace(/\./g, "")
      .replace(/\bst\b/g, "street")
      .replace(/\brd\b/g, "road")
      .replace(/\bave?\b/g, "avenue")
      .replace(/\bdr\b/g, "drive")
      .trim();

  const lhs = norm((input || "").trim());
  const rhs = norm([item.address.housenumber, item.address.street].filter(Boolean).join(" "));

  // only auto-pick if user typed >=5 chars and it's a clear prefix
  return lhs.length >= 5 && rhs.startsWith(lhs);
}
      return (
        <div style={{ position: "relative", width: "100%" }}>
          {/* 3. REMOVED: Internal <label> removed. Parent will provide it. */}
  <input
    value={q}
    onChange={onChange}
    onKeyDown={async (e) => {
      if ((e.key === "Enter" || e.key === "Tab") && predictions.length > 0) {
        const top = predictions[0];
        if (predictions.length === 1 || strongPrefixMatch(q, top)) {
          e.preventDefault();
          await onSelect(top);
        }
      }
    }}
    onBlur={async () => {
      if (predictions.length > 0) {
        const top = predictions[0];
        if (predictions.length === 1 || strongPrefixMatch(q, top)) {
          await onSelect(top);
        }
      }
    }}
    placeholder="Start typing street, suburb or city"
    style={{ padding: 12, borderRadius: 8, border: "1px solid #e5e7eb", width: "100%", outline: "none", boxSizing: "border-box", ...style }}
    aria-autocomplete="list"
    aria-controls="address-suggestions"
    aria-expanded={predictions.length > 0}
    required
  />

          {loading && <div style={{ position: "absolute", right: 10, top: 12 }}>…</div>}
          {error && <div style={{ color: "crimson", marginTop: 6, fontSize: 13 }}>{error}</div>}

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
                  // Add hover effect
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f4f5f7'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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