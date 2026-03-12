import React from "react";
import { SearchFunction } from "../components/searchfunction";
import { Link, useNavigate, NavLink } from "react-router";
import { BrowseCards } from "../cards/regularcards";
import { ViewMap } from "../components/mapintegration";
import { getDatabase, ref, onValue } from "firebase/database";
import { LoggedOutProviderBar } from '../navbar/notproviderbar';
import { EventCards } from "../cards/eventcards";


export function HealthEvents(){
    const filtereditems1 = ['Any Date', 'Today', 'This Weekend'];
    const filtereditems2 = ['All Events', 'Vaccine Drives', 'Health Screenings'];
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
                        <EventCards/>
                        <EventCards/>
                        <EventCards/>
                    </div>
                </div>
                <ViewMap/>
            </main>
        </>
    )
}