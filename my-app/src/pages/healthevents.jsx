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
import { geocodeAddress } from "../components/geocode";

export function HealthEvents(){
    const [events, setEvents] = useState({})
    const [eventsCoords, seteventsCoords] = useState({});
    const [zipQuery, setZipQuery] = useState("");

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

        const geocodeAll = async () => {
            const coords = {};
            for (const [name, info] of Object.entries(events)) {
                if (info.Address.includes("Multiple")) continue;
                await new Promise(r => setTimeout(r, 1000));
                const result = await geocodeAddress(info.Address);
                if (result) coords[name] = { lat: result.lat, lon: result.lon, address: info.Address, name: info.Name };
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
