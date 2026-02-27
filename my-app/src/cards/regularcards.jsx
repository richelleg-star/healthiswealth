import React from "react"

export function BrowseCards(props){

return(
    <div className="card">
        <div className="card-header">
            <div>
                <h2 className="card-title">Rainier Beach Medical Clinic</h2>
                    <div className="verified">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            Verified 2 days ago
                    </div>
            </div>
                <span className="badge free">Free Care</span>
        </div>
        <div className="info-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            8444 Rainier Ave S, Seattle, WA 98118
        </div>
        <div className="info-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                Walk-ins Accepted (Mon-Fri 9AM - 11AM)
        </div>
        <div className="tags">
            <span className="tag">Spanish Spoken</span>
            <span className="tag">Vietnamese Spoken</span>
            <span className="tag">Primary Care</span>
        </div>
        <div className="card-actions">
            <div className="btn-group">
                <a className="btn btn-primary">Get Directions</a>
                <a className="btn btn-outline">View Details</a>
            </div>
            <div className="info-row"> 
                🚍 Bus 7 (2 min walk)
            </div>
        </div>
    </div>
)

}

//style="margin:0; font-size: 0.8rem;" <- this is related to the style margines
                        
                            