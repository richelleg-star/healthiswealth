import React from "react";
import { LoggedOutProviderBar } from '../navbar/notproviderbar'
import { Link, useNavigate, NavLink } from "react-router-dom";
import { SearchFunction } from '../components/searchfunction'
import { BrowseCards } from "../cards/regularcards";
import { ViewMap } from "../components/mapintegration";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import { FooterForWeb } from "../navbar/footer";
import { DetailsModal } from "../components/viewdetails";
import { geocodeAddress } from "../components/geocode";
import { filterClinicsByZip } from "../components/filterforzip";

export function Homepage(props){
    const db = getDatabase()
    const [clinics, setClinics] = useState({})
    const [clinicCoords, setClinicCoords] = useState({});
    const [selected, setSelected] = useState(null);
    const [zipQuery, setZipQuery] = useState("");

    useEffect(() => {
        const db = getDatabase();
        const clinicRef = ref(db, "clinicalternatives");
        const unregisterFunction = onValue(clinicRef, (s) => {
            setClinics(s.val());
        }, (error) => {
            console.error("Error fetching clinics:", error);
        });
        return () => unregisterFunction();
    }, []);

    const allclinics = Object.entries(clinics);
    const visibleClinics = filterClinicsByZip(allclinics, zipQuery);

    useEffect(() => {
        if (Object.keys(clinics).length === 0) return;

        const geocodeAll = async () => {
            const coords = {};

            for (const [name, info] of Object.entries(clinics)) {
                // Single location — geocode top-level address
                if (!info.Address.includes("Multiple")) {
                    await new Promise(r => setTimeout(r, 1000));
                    const result = await geocodeAddress(info.Address);
                    if (result) coords[name] = { lat: result.lat, lon: result.lon, address: info.Address, name: info.Name };

                // Multiple locations — geocode each branch individually
                } else if (info.branches) {
                    for (const [branchKey, branch] of Object.entries(info.branches)) {
                        await new Promise(r => setTimeout(r, 1000));
                        const pinKey = `${name}__${branchKey}`;
                        const result = await geocodeAddress(branch.Address);
                        if (result) coords[pinKey] = { lat: result.lat, lon: result.lon, address: branch.Address, name: branch.Name };
                    }
                }
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

            <SearchFunction onSearch={(zip) => setZipQuery(zip)} />

            <main className="container">
                <div>
                    <div className="list-view">
                        {visibleClinics.length > 0 ? (
                            visibleClinics.map(([Name, clinicinfo]) => (
                                <BrowseCards 
                                    key={Name} 
                                    clinicinfo={clinicinfo}
                                    onViewDetails={(info) => setSelected(info)}
                                />
                            ))
                        ) : (
                            <p className="no-results">No clinics found for zip code <strong>{zipQuery}</strong>.</p>
                        )}
                    </div>
                </div>
                <ViewMap coords={clinicCoords}/>
            </main>
        </div>

        <DetailsModal selectedItem={selected} onClose={() => setSelected(null)} />

        <FooterForWeb/>
        </>
    )
}
