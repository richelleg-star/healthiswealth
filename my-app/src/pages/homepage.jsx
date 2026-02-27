import React from "react";
import { LoggedOutProviderBar } from '../navbar/notproviderbar'
import { Link, useNavigate, NavLink } from "react-router";
import { SearchFunction } from '../components/searchfunction'
import { BrowseCards } from "../cards/regularcards";
import { ViewMap } from "../components/mapintegration";
import { getDatabase, ref, onValue } from "firebase/database";

export function Homepage(props){
    const filtereditems1 = ['All Services', 'Primary Care', 'Dental', 'Mental Health']
    const filtereditems2 = ['Any Cost', 'Free Only', 'Sliding Scale']
    const db = getDatabase()
    return(
        <>
        <header>
            <LoggedOutProviderBar/>
        </header>
        <div id="patient-view" className="view-section active">
            <section className="hero">
                <h1>Find Affordable Care, Instantly.</h1>
                <p>No hidden fees. No language barriers. Search for free, sliding-scale, and community clinics near you in King County.</p>
                <SearchFunction filteritems1={filtereditems1} filteritems2={filtereditems2}/>
            </section>
            <main className="container">
                <div>
                    <div className="list-view">
                        <BrowseCards/>
                        <BrowseCards/>
                        <BrowseCards/>
                    </div>
                </div>
                <ViewMap/>
            </main>
        </div>
        </>
    )
}