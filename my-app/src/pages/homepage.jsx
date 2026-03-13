import React from "react";
import { LoggedOutProviderBar } from '../navbar/notproviderbar'
import { Link, useNavigate, NavLink } from "react-router-dom";
import { SearchFunction } from '../components/searchfunction'
import { BrowseCards } from "../cards/regularcards";
import { ViewMap } from "../components/mapintegration";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";


//npm run build THEN firebase deploy

export function Homepage(props){
    const filtereditems1 = ['All Services', 'Primary Care', 'Dental', 'Mental Health']
    const filtereditems2 = ['Any Cost', 'Free Only', 'Sliding Scale']
    const db = getDatabase()
    const [clinics, setClinics] = useState({})
    const [clinicCoords, setClinicCoords] = useState({});

// This will listen to our database and get the values need on each render
    useEffect(() => {
        const db = getDatabase(); // fetch the database
        const clinicRef = ref(db, "clinicalternatives"); // get a reference to the database, at clinicalalternaties
        const unregisterFunction = onValue(clinicRef, (s) => {
            setClinics(s.val());
        }, (error) => {
            console.error("Error fetching clinics:", error);
        });
        return () => unregisterFunction();
    }, []);

    const allclinics = Object.entries(clinics)
    console.log(clinicCoords)

// loads the coordinates for the map
    useEffect(() => {
        if (Object.keys(clinics).length === 0) return; // wait for clinics to load

        const geocodeAll = async () => {
            const coords = {};
            for (const [name, info] of Object.entries(clinics)) {
                if (info.Address.includes("Multiple")) continue;
                const encoded = encodeURIComponent(info.Address);
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json`, {
                    headers: { 'User-Agent': `healthiswealth (${import.meta.env.VITE_CONTACT_EMAIL})` } 
                });
                const data = await res.json();
                if (data[0]) coords[name] = { lat: data[0].lat, lon: data[0].lon };
                await new Promise(r => setTimeout(r, 1000));
            }
            setClinicCoords(coords);
        };
        geocodeAll();
    }, [clinics]); 

    return(
        <>
        <header>
            <LoggedOutProviderBar/>
        </header>
        <div id="patient-view" className="view-section active">
            <section className="hero">
                <h1>Find Affordable Care, Instantly.</h1>
                <p>No hidden fees. No language barriers. Search for free, sliding-scale, and community clinics near you in King County.</p>
            </section>
            <SearchFunction filteritems1={filtereditems1} filteritems2={filtereditems2}/>
            <main className="container">
                <div>
                    <div className="list-view">
                        {allclinics.map(([Name, clinicinfo]) => (
                            <BrowseCards key={Name} clinicinfo={clinicinfo} />
                        ))}
                    </div>
                </div>
                <ViewMap coords = {clinicCoords}/>
            </main>
        </div>
        </>
    )
}