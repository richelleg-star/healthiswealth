import React, { useEffect, useState } from "react";
import { SearchFunction } from "../components/searchfunction";
import { Link, useNavigate, NavLink } from "react-router";
import { BrowseCards } from "../cards/regularcards";
import { ViewMap } from "../components/mapintegration";
import { getDatabase, ref, onValue } from "firebase/database";
import { LoggedOutProviderBar } from '../navbar/notproviderbar';
import { EventCards } from "../cards/eventcards";
import { FooterForWeb } from "../navbar/footer";
import { filterEventsByZip } from "../components/filterforzip";

export function HealthEvents(){
    const [events, setEvents] = useState({})
    const [eventsCoords, seteventsCoords] = useState({});
    const [zipQuery, setZipQuery] = useState(""); // ← added

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

    // Apply zip filter — if zipQuery is empty, shows everything
    const visibleEvents = filterEventsByZip(allevents, zipQuery); // ← added

    useEffect(() => {
        if (Object.keys(events).length === 0) return;

        const geocodeAll = async () => {
            const coords = {};
            for (const [name, info] of Object.entries(events)) {
                if (info.Address.includes("Multiple")) continue;
                const encoded = encodeURIComponent(info.Address);
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json`, {
                    headers: { 'User-Agent': `healthiswealth (${import.meta.env.VITE_CONTACT_EMAIL})` }
                });
                const data = await res.json();
                if (data[0]) coords[name] = { lat: data[0].lat, lon: data[0].lon };
                await new Promise(r => setTimeout(r, 1000));
            }
            seteventsCoords(coords);
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

        {/* onSearch receives the zip string from SearchFunction */}
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
            <ViewMap coords={eventsCoords}/>
        </main>

        <FooterForWeb/>
        </>
    )
}
