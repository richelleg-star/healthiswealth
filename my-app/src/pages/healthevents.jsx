import React from "react";
import { SearchFunction } from "../components/searchfunction";
import { Link, useNavigate, NavLink } from "react-router";
import { BrowseCards } from "../cards/regularcards";
import { ViewMap } from "../components/mapintegration";
import { getDatabase, ref, onValue } from "firebase/database";
import { LoggedOutProviderBar } from '../navbar/notproviderbar';
import { EventCards } from "../cards/eventcards";
import { useEffect, useState } from "react";
import { FooterForWeb } from "../navbar/footer";

export function HealthEvents(){
    const filtereditems1 = ['Any Date', 'Today', 'This Weekend'];
    const filtereditems2 = ['All Events', 'Vaccine Drives', 'Health Screenings'];

    const [events, setEvents] = useState({})
    const [eventsCoords, seteventsCoords] = useState({});
    useEffect(() => {
        const db = getDatabase(); // fetch the database
        const eventRef = ref(db, "healthevents"); // get a reference to the database, at clinicalalternaties
        const unregisterFunction = onValue(eventRef, (s) => {
            
            setEvents(s.val());
        }, (error) => {
            console.error("Error fetching clinics:", error);
        });
        return () => unregisterFunction();
    }, []);

    const allevents = Object.entries(events)
    console.log(allevents)

    useEffect(() => {
        if (Object.keys(events).length === 0) return; // wait for clinics to load

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
        <SearchFunction filteritems1={filtereditems1} filteritems2={filtereditems2}/>
        <main className="container">
                <div>
                    <div className="list-view">
                                                {allevents.map(([Name, allevents]) => (
                                                    <EventCards key={Name} allevents={allevents} />
                                                ))}
                    </div>
                </div>
                <ViewMap coords={eventsCoords}/>
            </main>
        <FooterForWeb/>
        </>
    )
}