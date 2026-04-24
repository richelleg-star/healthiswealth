import React from "react";
import { NavLink } from "react-router-dom";

export function AddEvent() {
    return (
        <div className="provider-panel">
            <NavLink to="/homepage" className="logo">
                HealthIs<span>Wealth</span>
            </NavLink>
            <h2>Add Health Event</h2>
            <p>Add a community clinic, vaccine drive, screening, or health event for patients to find.</p>
            <form>
            <label>Event Name</label>
            <input type="text" placeholder="Free Community Health Screening" />
            <label>Event Date</label>
            <input type="date" />
            <label>Event Time</label>
            <input type="text" placeholder="10 AM - 2 PM" />
            <label>Event Location</label>
            <input type="text" placeholder="123 Main St, Seattle, WA" />
                <label>Service Type</label>
                <select>
                    <option>Vaccine Drive</option>
                    <option>Health Screening</option>
                    <option>Dental Clinic</option>
                    <option>Mental Health Support</option>
                    <option>General Community Health Event</option>
                </select>
            <label>Cost</label>
            <select>
                    <option>Free</option>
                    <option>Low cost</option>
                    <option>Sliding scale</option>
                </select>
            <label>Walk-in or Appointment</label>
                <select>
                    <option>Walk-ins accepted</option>
                    <option>Appointment required</option>
                    <option>Registration recommended</option>
                </select>
            <label>Language Support</label>
            <input type="text" placeholder="English, Spanish, Vietnamese" />
            <label>Extra Notes</label>
            <input type="text" placeholder="Bring ID if available, but no insurance required" />
            <button className="btn-save" type="submit">      Save Event
                </button>
            </form>
        </div>
    );
}