import React, { useState } from "react";

export function SearchFunction({ onSearch }) {
    const [zip, setZip] = useState("");

    const handleSearch = () => {
        onSearch(zip.trim());
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="search-wrapper">
            <div className="search-input">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                    type="text"
                    placeholder="Enter Zip Code (e.g. 98105)"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={5}
                />
            </div>
            {zip && (
                <button
                    className="btn-clear"
                    onClick={() => { setZip(""); onSearch(""); }}
                    aria-label="Clear search"
                >
                    ✕
                </button>
            )}
            <button className="btn-search" onClick={handleSearch}>Search</button>
        </div>
    );
}
