import React from "react";
import { NavLink } from "react-router-dom";

export function EditClinic() {
    return (
        <div className="provider-panel">
            <NavLink to="/homepage" className="logo">
                HealthIs<span>Wealth</span>
            </NavLink>
            <h2>Edit Clinic Information</h2>
            <p>Update the information patients see before visiting your clinic.</p>
            <form>
                <label>Clinic Name</label>
                <input type="text" placeholder="Rainier Beach Medical Clinic" />
                <label>Clinic Hours</label>
                <input type="text" placeholder="Mon-Fri, 9 AM - 5 PM" />
                <label>Walk-in Availability</label>
                <select>
                <option>Walk-ins accepted</option>
                <option>Appointment required</option>
                <option>Call first</option>
                </select>

                <label>Cost Information</label>
                <select>
                <option>Free</option>
                <option>Sliding scale</option>
                <option>Low cost</option>
                <option>Accepts uninsured patients</option>
                </select>
                <label>Language Support</label>
                <input type="text" placeholder="English, Spanish, Vietnamese" />
                <label>Documents Needed</label>
                <input type="text" placeholder="Photo ID, insurance card, proof of income" />
                <button className="btn-save" type="submit">
                Save Clinic Updates
                </button>
            </form>
        </div>
    );
}