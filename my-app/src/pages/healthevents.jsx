import React from "react";
import { LoggedOutProviderBar } from "../navbar/notproviderbar";

export function HealthEvents() {
  return (
<>
 <header>
    <LoggedOutProviderBar />
</header>
    <div id="events-view" className="view-section">
    <section className="hero">
        <h1>Community Health Events</h1>
          <p>
            Find free pop-up clinics, health fairs, and vaccination drives
            happening this week.
          </p>

        <div className="search-wrapper">
        <select className= "filter-select">
            <option>Any Date</option>
            <option>Today</option>
            <option>This Weekend</option>
        </select>

        <select className= "filter-select">
            <option>All Events</option>
            <option>Vaccine Drives</option>
            <option>Health Screenings</option>
        </select>
        <button className= "btn-search">Search Events</button>
          </div>
    </section>
    <main className="container">
        <div>
            <p className="results-header">Showing 3 upcoming events near you</p>
        <div className="list-view">
        <div className="card">
        <div className="card-header">
            <h3>Pop-up Flu Shot Clinic</h3>
            <span className="badge event">Hosted by Public Health</span>
        </div>
        <div className="card-meta">
            <span className="badge free">Free Event</span>
        </div>
            <p className="clinic-address">
                  3801 S Othello St, Seattle, WA 98118
            </p>
            <p className="clinic-hours">This Saturday, 10:00 AM - 2:00 PM</p>
        <div className="tags">
            <span className="tag">Vaccines</span>
            <span className="tag">No ID Required</span>
            <span className="tag">Kids 6mo+</span>
        </div>
        <div className="card-actions">
            <button className="btn btn-outline">Get Directions</button>
            <button className="btn btn-primary">Set Reminder</button>
        </div>
        </div>
        <div className="card">
        <div className="card-header">
            <h3>Back-to-School Dental Van</h3>
                <span className="badge event">Hosted by UW Dentistry</span>
        </div>
        <div className="card-meta">
                <span className="badge free">Free Care</span>
        </div>
            <p className="clinic-address">
                  South Park Community Center (Parking Lot)
            </p>
            <p className="clinic-hours">Next Tuesday, 9:00 AM - 4:00 PM</p>
        <div className="tags">
                <span className="tag">Dental</span>
                <span className="tag">Youth 0-18</span>
                <span className="tag">Spanish Spoken</span>
        </div>
        <div className="card-actions">
                <button className="btn btn-outline">Get Directions</button>
                <button className="btn btn-primary">Set Reminder</button>
        </div>
        </div>
        <div className="card">
        <div className="card-header">
                <h3>Diabetes &amp; BP Screening Fair</h3>
                <span className="badge event">Hosted by Sea Mar</span>
        </div>
        <div className="card-meta">
                 <span className="badge free">Open to All</span>
        </div>
                <p className="clinic-address">
                  Rainier Beach High School Gym
                </p>
                <p className="clinic-hours">Sunday, March 15th, 12:00 PM - 5:00 PM</p>
        <div className="tags">
                <span className="tag">Health Screening</span>
                <span className="tag">Adults</span>
                <span className="tag">Vietnamese Spoken</span>
        </div>
        <div className="card-actions">
                <button className="btn btn-outline">Get Directions</button>
                <button className="btn btn-primary">Set Reminder</button>
        </div>
        </div>
        </div>
        </div>
        <div className="map-container">
            <h2>Event Map View</h2>
        <div className="map-placeholder">Google Maps API</div>
        </div>
        </main>
      </div>
    </>
  );
}