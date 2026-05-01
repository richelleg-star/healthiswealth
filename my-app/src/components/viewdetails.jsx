import { useState } from "react";

export function ViewDetails(props) {
    return (
        <button 
            className="btn btn-outline" 
            onClick={() => props.onViewDetails(props.clinicinfo)}
        >
            View Details
        </button>
    );
}