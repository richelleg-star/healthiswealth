import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, push, set as fireSet, remove, query, orderByChild, equalTo, get, update } from "firebase/database";
import { ProviderBar } from "../navbar/providerbar";
import { auth } from "../../firebase";
import { TagInput } from "../components/maketags";
import { SubBar } from "../navbar/subbar";

export function AddEvent() {
    const [eventName, setEventName] = useState('');
    const [eventDateStart, setEventDateStart] = useState('');
    const [eventDateEnd, setEventDateEnd] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [tags, setTags] = useState([]);
    const [cost, setCost] = useState('Free');
    const [walkIn, setWalkIn] = useState(true);
    const [languages, setLanguages] = useState('');
    const [link, setLink] = useState('');
    const [notes, setNotes] = useState('');

    const [myEvents, setMyEvents] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [view, setView] = useState("add");

    const [editingEvent, setEditingEvent] = useState(null);
    const [editForm, setEditForm] = useState({});

    const db = getDatabase();
    const navigate = useNavigate();

    useEffect(() => {
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

    useEffect(() => {
        const fetchEvents = async () => {
            const user = auth.currentUser;
            if (!user) return;

            const eventsRef = ref(db, "healthevents");
            const q = query(eventsRef, orderByChild("uid"), equalTo(user.uid));
            const snapshot = await get(q);

            if (snapshot.exists()) {
                const userEvents = [];
                snapshot.forEach((child) => {
                    const data = child.val();
                    const rawTags = data.Tags; // capital T
                    userEvents.push({
                        id: child.key,
                        ...data,
                        tags: Array.isArray(rawTags) ? rawTags : rawTags ? Object.values(rawTags) : [],
                    });
                });
                setMyEvents(userEvents);
            } else {
                console.log("No events found for this user");
            }
        };

        fetchEvents();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) { navigate('/providerlogin'); return; }
        if (!eventName || !eventDateStart || !eventDateEnd || !eventLocation || !languages) {
            alert('One or more of your fields is currently empty');
            return;
        }
        try {
            const eventsRef = ref(db, 'healthevents');
            const newEventRef = push(eventsRef);
            await fireSet(newEventRef, {
                Name: eventName,
                "Date End": eventDateEnd,
                "Date Start": eventDateStart,
                Address: eventLocation,
                freeOrLowCost: cost,
                needapt: walkIn,
                "Language Spoken": languages,
                notes: notes,
                Tags: tags,         // capital T
                link: link,
                uid: auth.currentUser.uid
            });
            alert('Event saved successfully!');
            navigate('/homepage');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleRemove = async (eventId, name) => {
        if (!window.confirm(`Remove "${name}"? This cannot be undone.`)) return;
        try {
            await remove(ref(db, `healthevents/${eventId}`));
            setMyEvents(prev => prev.filter(e => e.id !== eventId));
            alert('Event removed.');
        } catch (error) {
            alert(error.message);
        }
    };

    const normalizeTags = (tags) => {
        if (!tags) return [];
        if (Array.isArray(tags)) return tags;
        return Object.values(tags);
    };

    const handleEditClick = (event) => {
        setEditingEvent(event.id);
        setEditForm({
            Name: event.Name || '',
            "Date Start": event["Date Start"] || '',
            "Date End": event["Date End"] || '',
            Address: event.Address || '',
            freeOrLowCost: event.freeOrLowCost || 'Free',
            needapt: event.needapt ?? true,
            "Language Spoken": event["Language Spoken"] || '',
            notes: event.notes || '',
            tags: normalizeTags(event.Tags), // capital T
            link: event.link || '',
        });
    };

    const handleEditSave = async (eventId) => {
        try {
            await update(ref(db, `healthevents/${eventId}`), {
                Name: editForm.Name,
                "Date Start": editForm["Date Start"],
                "Date End": editForm["Date End"],
                Address: editForm.Address,
                freeOrLowCost: editForm.freeOrLowCost,
                needapt: editForm.needapt,
                "Language Spoken": editForm["Language Spoken"],
                notes: editForm.notes,
                Tags: editForm.tags,  // capital T
                link: editForm.link,
            });
            setMyEvents(prev => prev.map(e =>
                e.id === eventId ? { ...e, ...editForm, Tags: editForm.tags } : e
            ));
            setEditingEvent(null);
            alert('Event updated!');
        } catch (error) {
            alert(error.message);
        }
    };

    if (!authChecked) return null;

    return (
        <>
            <ProviderBar />
            <SubBar
                view={view}
                onViewChange={setView}
                tabs={[
                    { label: "Add Event", value: "add" },
                    { label: "Edit Event", value: "edit" },
                ]}
            />

            <div className="provider-panel" style={{ maxWidth: '700px', margin: '2rem auto' }}>

                {/* ADD VIEW */}
                {view === "add" && (
                    <>
                        <h2>Add Health Event</h2>
                        <p>Add a community clinic, vaccine drive, screening, or health event for patients to find.</p>
                        <form onSubmit={handleSubmit}>
                            <label>Event Name</label>
                            <input type="text" placeholder="Free Community Health Screening"
                                value={eventName} onChange={(e) => setEventName(e.target.value)} />
                            <label>Date Start</label>
                            <input type="datetime-local" value={eventDateStart} onChange={(e) => setEventDateStart(e.target.value)} />
                            <label>Date End</label>
                            <input type="datetime-local" value={eventDateEnd} onChange={(e) => setEventDateEnd(e.target.value)} />
                            <label>Event Location</label>
                            <input type="text" placeholder="123 Main St, Seattle, WA"
                                value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
                            <label>Tags</label>
                            <TagInput value={tags} onChange={setTags} placeholder="e.g. Free, Mental Health, Dental" />
                            <label>Cost</label>
                            <select value={cost} onChange={(e) => setCost(e.target.value)}>
                                <option>Free</option>
                                <option>Low cost</option>
                            </select>
                            <label>Need Appointment</label>
                            <select value={walkIn} onChange={(e) => setWalkIn(e.target.value)}>
                                <option value={true}>True</option>
                                <option value={false}>False</option>
                            </select>
                            <label>Language Support</label>
                            <input type="text" placeholder="English, Spanish, Vietnamese"
                                value={languages} onChange={(e) => setLanguages(e.target.value)} />
                            <label>Extra Notes</label>
                            <input type="text" placeholder="Bring ID if available, but no insurance required"
                                value={notes} onChange={(e) => setNotes(e.target.value)} />
                            <label>Link to Event</label>
                            <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
                            <button className="btn-save" type="submit">Save Event</button>
                        </form>
                    </>
                )}

                {/* EDIT VIEW */}
                {view === "edit" && (
                    <>
                        <h2>Edit Your Events</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Select an event to edit or remove it.
                        </p>
                        {myEvents.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>You haven't posted any events yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {myEvents.map((event) => (
                                    <div key={event.id} style={{
                                        border: '1px solid var(--border)',
                                        borderRadius: '10px',
                                        background: 'var(--bg-color)',
                                        overflow: 'hidden',
                                    }}>
                                        {/* Event row */}
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            alignItems: 'center', padding: '1rem',
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>
                                                    {event.Name}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                    {event["Date Start"]} · {event.Address}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => editingEvent === event.id ? setEditingEvent(null) : handleEditClick(event)}
                                                    style={{
                                                        background: 'transparent',
                                                        border: '1px solid var(--border)',
                                                        color: 'var(--text-muted)',
                                                        borderRadius: '6px',
                                                        padding: '0.4rem 0.9rem',
                                                        fontFamily: 'inherit',
                                                        fontWeight: '600',
                                                        fontSize: '0.85rem',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {editingEvent === event.id ? 'Cancel' : 'Edit'}
                                                </button>
                                                <button
                                                    onClick={() => handleRemove(event.id, event.Name)}
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
                                                    }}
                                                    onMouseEnter={e => { e.target.style.background = '#ef4444'; e.target.style.color = 'white'; }}
                                                    onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#ef4444'; }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Inline edit form */}
                                        {editingEvent === event.id && (
                                            <div style={{
                                                borderTop: '1px solid var(--border)',
                                                padding: '1rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.75rem',
                                            }}>
                                                <label>Event Name</label>
                                                <input type="text" value={editForm.Name}
                                                    onChange={e => setEditForm(f => ({ ...f, Name: e.target.value }))} />
                                                <label>Date Start</label>
                                                <input type="datetime-local" value={editForm["Date Start"]}
                                                    onChange={e => setEditForm(f => ({ ...f, "Date Start": e.target.value }))} />
                                                <label>Date End</label>
                                                <input type="datetime-local" value={editForm["Date End"]}
                                                    onChange={e => setEditForm(f => ({ ...f, "Date End": e.target.value }))} />
                                                <label>Address</label>
                                                <input type="text" value={editForm.Address}
                                                    onChange={e => setEditForm(f => ({ ...f, Address: e.target.value }))} />
                                                <label>Tags</label>
                                                <TagInput
                                                    value={editForm.tags}
                                                    onChange={val => setEditForm(f => ({ ...f, tags: val }))}
                                                />
                                                <label>Cost</label>
                                                <select value={editForm.freeOrLowCost}
                                                    onChange={e => setEditForm(f => ({ ...f, freeOrLowCost: e.target.value }))}>
                                                    <option>Free</option>
                                                    <option>Low cost</option>
                                                </select>
                                                <label>Need Appointment</label>
                                                <select value={editForm.needapt}
                                                    onChange={e => setEditForm(f => ({ ...f, needapt: e.target.value }))}>
                                                    <option value={true}>True</option>
                                                    <option value={false}>False</option>
                                                </select>
                                                <label>Language Support</label>
                                                <input type="text" value={editForm["Language Spoken"]}
                                                    onChange={e => setEditForm(f => ({ ...f, "Language Spoken": e.target.value }))} />
                                                <label>Extra Notes</label>
                                                <input type="text" value={editForm.notes}
                                                    onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
                                                <label>Link to Event</label>
                                                <input type="text" value={editForm.link}
                                                    onChange={e => setEditForm(f => ({ ...f, link: e.target.value }))} />
                                                <button
                                                    className="btn-save"
                                                    onClick={() => handleEditSave(event.id)}
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}