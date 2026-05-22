import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, push, set as fireSet } from "firebase/database";

export function AddEvent() {
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [serviceType, setServiceType] = useState('Vaccine Drive');
    const [cost, setCost] = useState('Free');
    const [walkIn, setWalkIn] = useState('Walk-ins accepted');
    const [languages, setLanguages] = useState('');
    const [notes, setNotes] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Make sure the provider is logged in before uploading
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            alert('You must be logged into your clinic account to add an event.');
            navigate('/providerlogin');
            return;
        }

        // Validate fields are not empty
        if (!eventName || !eventDate || !eventTime || !eventLocation || !languages) {
            alert('One or more of your fields is currently empty');
            return;
        }

        try {
            const db = getDatabase();
            // Push a new event under healthevents — all fields below are public
            const eventsRef = ref(db, 'healthevents');
            const newEventRef = push(eventsRef);

            await fireSet(newEventRef, {
                eventName,
                eventDate,
                eventTime,
                eventLocation,
                serviceType,
                cost,
                walkIn,
                languages,
                notes,
                // Store which clinic posted this event
                postedBy: user.uid,
            });

            alert('Event saved successfully!');
            navigate('/homepage');
        } catch (error) {
            console.log(error.code, error.message);
            alert(error.message);
        }
    };

    return (
        <div className="provider-panel">
            <NavLink to="/homepage" className="logo">
                HealthIs<span>Wealth</span>
            </NavLink>
            <h2>Add Health Event</h2>
            <p>Add a community clinic, vaccine drive, screening, or health event for patients to find.</p>
            <form onSubmit={handleSubmit}>
                <label>Event Name</label>
                <input
                    type="text"
                    placeholder="Free Community Health Screening"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                />
                <label>Event Date</label>
                <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                />
                <label>Event Time</label>
                <input
                    type="text"
                    placeholder="10 AM - 2 PM"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                />
                <label>Event Location</label>
                <input
                    type="text"
                    placeholder="123 Main St, Seattle, WA"
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                />
                <label>Service Type</label>
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
                    <option>Vaccine Drive</option>
                    <option>Health Screening</option>
                    <option>Dental Clinic</option>
                    <option>Mental Health Support</option>
                    <option>General Community Health Event</option>
                </select>
                <label>Cost</label>
                <select value={cost} onChange={(e) => setCost(e.target.value)}>
                    <option>Free</option>
                    <option>Low cost</option>
                    <option>Sliding scale</option>
                </select>
                <label>Walk-in or Appointment</label>
                <select value={walkIn} onChange={(e) => setWalkIn(e.target.value)}>
                    <option>Walk-ins accepted</option>
                    <option>Appointment required</option>
                    <option>Registration recommended</option>
                </select>
                <label>Language Support</label>
                <input
                    type="text"
                    placeholder="English, Spanish, Vietnamese"
                    value={languages}
                    onChange={(e) => setLanguages(e.target.value)}
                />
                <label>Extra Notes</label>
                <input
                    type="text"
                    placeholder="Bring ID if available, but no insurance required"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <button className="btn-save" type="submit">Save Event</button>
            </form>
        </div>
    );
}
