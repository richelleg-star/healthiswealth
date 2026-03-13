import React from "react"
import { useState } from 'react';
import { Map, Marker } from 'pigeon-maps'

export function ViewMap(props) {
    const coords = props.coords
    console.log(coords)
    return (
        <div className="map-container">
            <Map
                height={window.innerHeight - 128}
                defaultCenter={[47.44, -122.24]}
                defaultZoom={11}
            >
            {Object.entries(coords).map(([name, {lat, lon}]) => (
                <Marker
                    key={name}
                    width={50}
                    anchor={[Number(lat), Number(lon)]}  // convert strings to numbers
                    onClick={() => setHue(hue + 20)}
                />
            ))}
            </Map>
        </div>
    )
}

// style: style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;