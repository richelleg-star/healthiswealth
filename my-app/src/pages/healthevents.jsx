import React, { useEffect, useState, useRef } from "react";
import { SearchFunction } from "../components/searchfunction";
import { Link, useNavigate, NavLink } from "react-router";
import { BrowseCards } from "../cards/regularcards";
import { ViewMap } from "../components/mapintegration";
import { getDatabase, ref, onValue } from "firebase/database";
import { LoggedOutProviderBar } from '../navbar/notproviderbar';
import { EventCards } from "../cards/eventcards";
import { FooterForWeb } from "../navbar/footer";
import { geocodeAddress, pruneCache } from "../components/geocode";
import { filterEventsByZip } from "../components/filterforzip";

export function HealthEvents(){
    const [events, setEvents] = useState({})
    const [eventsCoords, seteventsCoords] = useState({});
    const [zipQuery, setZipQuery] = useState("");
    const [isGeocoding, setIsGeocoding] = useState(false);
    const hasGeocoded = useRef(false); // guard to prevent re-running

    useEffect(() => {
        const db = getDatabase();
        const eventRef = ref(db, "healthevents");
        const unregisterFunction = onValue(eventRef, (s) => {
            setEvents(s.val() ?? {});
        }, (error) => {
            console.error("Error fetching events:", error);
        });
        return () => unregisterFunction();
    }, []);

    const allevents = events ? Object.entries(events) : [];
    const visibleEvents = filterEventsByZip(allevents, zipQuery);

    useEffect(() => {
        if (Object.keys(events).length === 0) return;
        if (hasGeocoded.current) return; // already ran, don't repeat
        hasGeocoded.current = true;

        // Prune stale cache entries for deleted events
        const activeAddresses = Object.values(events)
            .filter(info => !info.Address.includes("Multiple"))
            .map(info => info.Address);
        pruneCache(activeAddresses);

        const geocodeAll = async () => {
            setIsGeocoding(true);
            const coords = {};

            for (const [key, info] of Object.entries(events)) {
                if (info.Address.includes("Multiple")) continue;
                await new Promise(r => setTimeout(r, 1000));
                const result = await geocodeAddress(info.Address);
                if (result) coords[key] = { lat: result.lat, lon: result.lon, address: info.Address, name: info.Name };

                // Update map progressively as each pin comes in
                seteventsCoords({ ...coords });
            }

            setIsGeocoding(false);
        };
        geocodeAll();
    }, [events]);

    return(
        <>
        <header>
            <LoggedOutProviderBar/>
        </header>

        <div id="events-view" className="view-section">
            <section className="hero">
                <h1>Community Health Events</h1>
                <p>Find free pop-up clinics, health fairs, and vaccination drives happening this week.</p>
            </section>
        </div>

        <SearchFunction onSearch={(zip) => setZipQuery(zip)} />

        <main className="container">
            <div>
                <div className="list-view">
                    {visibleEvents.length > 0 ? (
                        visibleEvents.map(([Name, eventData]) => (
                            <EventCards key={Name} allevents={eventData} />
                        ))
                    ) : (
                        <p className="no-results">No events found for zip code <strong>{zipQuery}</strong>.</p>
                    )}
                </div>
            </div>
            <ViewMap coords={eventsCoords} isLoading={isGeocoding} />
        </main>

        <FooterForWeb/>
        </>
    )
}
