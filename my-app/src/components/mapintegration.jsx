import React from "react"
import {
  MapContainer,
  TileLayer,
  useMap,
} from 'https://cdn.esm.sh/react-leaflet';
import { useState } from 'react';


export function ViewMap(){
    return(
        <div className="map-container">
            <div className="map-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {/* <MapContainer
                            className="markercluster-map"
                            center={[51.0, 19.0]}
                            zoom={4}
                            maxZoom={18}
                            >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />

                            </MapContainer> */}
                                                </div>
                                            </div>
                            )
}

// style: style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;