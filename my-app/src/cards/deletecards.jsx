import React, { useState } from "react";
import { CalendarIntegration } from "../components/calendarintegration";
import { ViewDetails, DetailsModal } from "../components/viewdetails";

export function DeleteCards(props){

const alleventinfo = props.allevents
const [selected, setSelected] = useState(null);
// props for the allevents


// on click function for directions
const eventAddress = (alleventinfo.Address ?? '').replace(/[,\s]+/g, '+')
const mapsurl = 'https://maps.google.com/?q=' + eventAddress

const openInNewTab = (url) => {
  const newWindow = window.open(mapsurl, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}

// http://maps.google.com/?q=your+query <- how each url should be handled
// example of a valud url: http://maps.google.com/?q=305+Harrison+St+Seattle+WA+98109
const alleventinfoTags = Array.isArray(alleventinfo.Tags) ? alleventinfo.Tags : [];

let WalkinOrApt = ''
if(alleventinfo.needapt == true){
    WalkinOrApt = 'Appointment is Needed'
}
else(
    WalkinOrApt = 'Walk-in Accepted'
)

    const deleteClinicEvent = async (eventId) => {
        const db = getDatabase();
        await remove(ref(db, `healthevents/${eventId}`));
        
        // Remove it from local state too so the UI updates instantly
        setEvents(events.filter(e => e.id !== eventId));
    };


return(
    <>
    <div className="card">
        <div className="card-header">
            <div>
                <h2 className="card-title">{alleventinfo.Name}</h2>
                    <div className="verified">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            Verified 2 days ago
                    </div>
            </div>
                <span className="badge free">{alleventinfo.freeOrLowCost}</span>
        </div>
        <div className="info-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {alleventinfo.Address}
        </div>
        <div className="info-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                {WalkinOrApt} ({alleventinfo.Time})
        </div>
        <div className="tags">
                        {alleventinfoTags.map((s, i) => (
                            <span key={i} className="tag">{s}</span>
                        ))}
        </div>
        <div className="card-actions">
            <div className="btn-group">
                <button className="btn btn-primary" onClick={openInNewTab}>Get Directions</button>
                <ViewDetails clinicinfo={alleventinfo} onViewDetails={setSelected} />
                <CalendarIntegration
                    name={alleventinfo['Name']}
                    startDate={alleventinfo['Date Start']}
                    endDate={alleventinfo['Date Start']}
                    location={alleventinfo['Address']}
                    language={alleventinfo['Language Spoken']}
                    link={alleventinfo['link']}
                />
                <button className="btn btn-delete" onClick={deleteClinicEvent}>Delete Event</button>
            </div>
        </div>
    </div>
    <DetailsModal selectedItem={selected} onClose={() => setSelected(null)} />
    </>
)

}                           

//style="margin:0; font-size: 0.8rem;" <- this is related to the style margines
                        
