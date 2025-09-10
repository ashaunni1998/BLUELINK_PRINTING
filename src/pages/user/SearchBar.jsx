import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config";

const SearchBar = () => {
  const [query, setQuery] = useState("");       // user input
  const [results, setResults] = useState([]);   // matched products

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]); // empty query = empty results
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/search?query=${query}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    // add debounce so it doesn't fire on every keystroke
    const delay = setTimeout(() => {
      fetchResults();
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      {/* Show dynamic results */}
      {results.length > 0 && (
        <ul className="results-dropdown">
          {results.map((item) => (
            <li key={item.id} className="result-item">
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
