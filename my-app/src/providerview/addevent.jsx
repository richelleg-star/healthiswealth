import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, push, set as fireSet, remove, onValue } from "firebase/database";
import { ProviderBar } from "../navbar/providerbar";

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

    const [myEvents, setMyEvents] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    const navigate = useNavigate();

    // Auth guard — redirect if not logged in
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            } else {
                navigate('/providerlogin');
            }
            setAuthChecked(true);
        });
        return () => unsubscribe();
    }, []);

    // Load only this provider's events
    useEffect(() => {
        if (!currentUser) return;
        const db = getDatabase();
        const eventsRef = ref(db, 'healthevents');
        const unsubscribe = onValue(eventsRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) { setMyEvents([]); return; }
            const filtered = Object.entries(data)
                .filter(([, event]) => event.postedBy === currentUser.uid)
                .map(([key, event]) => ({ key, ...event }));
            setMyEvents(filtered);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('You must be logged in to add an event.');
            navigate('/providerlogin');
            return;
        }
        if (!eventName || !eventDate || !eventTime || !eventLocation || !languages) {
            alert('One or more of your fields is currently empty');
            return;
        }
        try {
            const db = getDatabase();
            const eventsRef = ref(db, 'healthevents');
            const newEventRef = push(eventsRef);

            await fireSet(newEventRef, {
                Name,
                "Date End": dateEnd,
                "Date Start": dateStart,
                Address,
                Time,
                freeOrLowCost,
                needapt,
                "Language Spoken": languages,
                notes,
                // Store which clinic posted this event
                uid: user.uid,
            });

            alert('Event saved successfully!');
            navigate('/homepage');
        } catch (error) {
            console.log(error.code, error.message);
            alert(error.message);
        }
    };

    const handleRemove = async (eventKey, name) => {
        if (!window.confirm(`Remove "${name}"? This cannot be undone.`)) return;
        try {
            const db = getDatabase();
            await remove(ref(db, `healthevents/${eventKey}`));
            alert('Event removed.');
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    if (!authChecked) return null;

    return (
        <>
            <ProviderBar />
            <div className="provider-panel" style={{ maxWidth: '700px', margin: '2rem auto' }}>

                {/* Add Event Form */}
                <h2>Add Health Event</h2>
                <p>Add a community clinic, vaccine drive, screening, or health event for patients to find.</p>
                <form onSubmit={handleSubmit}>
                    <label>Event Name</label>
                    <input type="text" placeholder="Free Community Health Screening"
                        value={eventName} onChange={(e) => setEventName(e.target.value)} />
                    <label>Event Date</label>
                    <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                    <label>Event Time</label>
                    <input type="text" placeholder="10 AM - 2 PM"
                        value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                    <label>Event Location</label>
                    <input type="text" placeholder="123 Main St, Seattle, WA"
                        value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
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
                    <input type="text" placeholder="English, Spanish, Vietnamese"
                        value={languages} onChange={(e) => setLanguages(e.target.value)} />
                    <label>Extra Notes</label>
                    <input type="text" placeholder="Bring ID if available, but no insurance required"
                        value={notes} onChange={(e) => setNotes(e.target.value)} />
                    <button className="btn-save" type="submit">Save Event</button>
                </form>

                {/* Remove Event Section */}
                {myEvents.length > 0 && (
                    <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                        <h2>Remove an Event</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            These are the events you've posted. Click Remove to delete one.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {myEvents.map((event) => (
                                <div key={event.key} style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', padding: '1rem',
                                    border: '1px solid var(--border)', borderRadius: '10px',
                                    background: 'var(--bg-color)',
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                            {event.eventName}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            {event.eventDate} · {event.eventLocation}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(event.key, event.eventName)}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid #ef4444',
                                            color: '#ef4444',
                                            borderRadius: '6px',
                                            padding: '0.4rem 0.9rem',
                                            fontFamily: 'inherit',
                                            fontWeight: '600',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            whiteSpace: 'nowrap',
                                        }}
                                        onMouseEnter={e => { e.target.style.background = '#ef4444'; e.target.style.color = 'white'; }}
                                        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#ef4444'; }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
