import React, { useState } from "react";
import { Map, Overlay } from 'pigeon-maps';

// onclick created with claude, debugged overlay with claude

export function ViewMap({ coords, isLoading }) {
    const [activePin, setActivePin] = useState(null);

    return (
        <div className="map-container" style={{ position: "relative" }}>
            {/* Loading overlay */}
            {isLoading && (
                <div style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "999px",
                    padding: "6px 14px",
                    fontSize: "0.8rem",
                    color: "#64748b",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    zIndex: 200,
                    pointerEvents: "none",
                }}>
                    <span style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        border: "2px solid #6d28d9",
                        borderTopColor: "transparent",
                        display: "inline-block",
                        animation: "spin 0.8s linear infinite",
                    }}/>
                    Loading map pins...
                </div>
            )}

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <Map
                height={window.innerHeight - 128}
                defaultCenter={[47.44, -122.24]}
                defaultZoom={11}
                onClick={() => setActivePin(null)}
            >
                {Object.entries(coords).map(([key, { lat, lon, address, name }]) => {
                    const isActive = activePin === key;

                    return (
                        <Overlay key={key} anchor={[Number(lat), Number(lon)]} offset={[0, 60]}>
                            <div style={{ position: "relative", display: "inline-block" }}>
                                {/* Tooltip */}
                                {isActive && (
                                    <div style={{
                                        position: "absolute",
                                        bottom: "100%",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        marginBottom: "6px",
                                        background: "white",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: "8px",
                                        padding: "8px 12px",
                                        fontSize: "0.8rem",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                        whiteSpace: "nowrap",
                                        pointerEvents: "none",
                                        zIndex: 100,
                                    }}>
                                        <div style={{ fontWeight: "700", marginBottom: "2px" }}>{name}</div>
                                        {address && (
                                            <div style={{ color: "#64748b", fontSize: "0.75rem" }}>{address}</div>
                                        )}
                                    </div>
                                )}

                                {/* Pin */}
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill={isActive ? "#6d28d9" : "#ef4444"}
                                    style={{ cursor: "pointer", display: "block" }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActivePin(isActive ? null : key);
                                    }}
                                >
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </div>
                        </Overlay>
                    );
                })}
            </Map>
        </div>
    );
}
