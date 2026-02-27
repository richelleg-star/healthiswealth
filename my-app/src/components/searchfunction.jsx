import React from "react";
import { LoggedOutProviderBar } from '../navbar/notproviderbar'
import { Link, useNavigate, NavLink } from "react-router";

export function SearchFunction(props){
    const filteredtext1 = props.filteritems1
    console.log(filteredtext1)
    const indivifilteredtext1 = filteredtext1.map((obj) => {
        const components = <option key={obj}>{obj}</option>
        return components
    })
    const filteredtext2 = props.filteritems2
    const indivifilteredtext2 = filteredtext2.map((obj) => {
        const components = <option key={obj}>{obj}</option>
        return components
    })

    return(
        <div className="search-wrapper">
            
            <div className="search-input">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Enter Zip Code, City, or Neighborhood (e.g., 98105)"/>
            </div>
            <select className="filter-select" aria-label="Service Type">
                {indivifilteredtext1}
            </select>
            <select className="filter-select" aria-label="Cost Filter">
                {indivifilteredtext2}
            </select>
            <button className="btn-search">Search</button>
        </div>
    )
}