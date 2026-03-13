import React from "react"
import { useState } from "react"
export function BrowseCards(props){

const allclinicinfo = props.clinicinfo
console.log(allclinicinfo)
console.log(allclinicinfo.Name)

const clinicAddress = (allclinicinfo.Address).replace(/[,\s]+/g, '+')
const mapsurl = 'https://maps.google.com/?q=' + clinicAddress

const openInNewTab = (url) => {
  const newWindow = window.open(mapsurl, '_blank', 'noopener,noreferrer')
  if (newWindow) newWindow.opener = null
}



console.log(allclinicinfo.Address)

const allclinicinfoTags = allclinicinfo.Tags

let WalkinOrApt = ''

if(allclinicinfo.needapt == true){
    WalkinOrApt = 'Appointment is Needed'
}
else(
    WalkinOrApt = 'Walk-in Accepted'
)

return(
    <div className="card">
        <div className="card-header">
            <div>
                <h2 className="card-title">{allclinicinfo.Name}</h2>
                    <div className="verified">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            Verified 2 days ago
                    </div>
            </div>
                <span className="badge free">{allclinicinfo.freeOrLowCost}</span>
        </div>
        <div className="info-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {allclinicinfo.Address}
        </div>
        <div className="info-row">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                {WalkinOrApt} ({allclinicinfo.hours})
        </div>
        <div className="tags">
                        {allclinicinfoTags.map((s) => (
                            <span className="tag">{s}</span>
                        ))}
        </div>
        <div className="card-actions">
            <div className="btn-group">
                {allclinicinfo.Address !== "Multiple Locations; See More Details" && (
                    <>
                    <button className="btn btn-primary" onClick={openInNewTab}>Get Directions</button>
                    <a className="btn btn-outline">View Details</a> 
                    </>
                )}
                {allclinicinfo.Address == "Multiple Locations; See More Details" && (
                    <>
                    <a className="btn btn-primary">View Details</a> 
                    </>
                )}
                
                
            </div>
            <div className="info-row"> 
                🚍 Bus 7 (2 min walk)
            </div>
        </div>
    </div>
)

}

//style="margin:0; font-size: 0.8rem;" <- this is related to the style margines
                        
                            