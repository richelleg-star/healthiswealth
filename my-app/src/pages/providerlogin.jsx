import React from "react";
import { LoggedOutProviderBar } from "../navbar/notproviderbar";

export function ProviderLogin() {
  return (
<>
<header>
  <LoggedOutProviderBar />
</header>
    <div id="provider-view" className="view-section">
      <section className="hero">
        <h1>Provider Portal</h1>
          <p>
            Manage your clinic's public listing on HealthIsWealth to ensure
            patients have accurate access data.
          </p>
      </section>
<main className="container">
    <div className="provider-panel">
        <h2>Live Status Updates</h2>
    <div className="provider-row">
          <label>Accepting Walk-ins?</label>
            <input type="checkbox" defaultChecked />
    </div>
        <p>Toggle off if you are at capacity today.</p>
    <div className="provider-row">
          <label>Accepting Uninsured?</label>
            <input type="checkbox" defaultChecked />
    </div>
          <p>Update if grant funding changes.</p>
    <div className="provider-row">
          <label>Listing Verified</label>
            <span>Last verified by staff: Today</span>
    </div>
          <button>Re-verify Now</button>
    </div>
    <div className="provider-panel">
        <h2>Clinic Details</h2>
          <label>Operating Hours</label>
          <input type="text" placeholder="Mon-Fri 9AM - 5PM" />
          <label>Primary Language Support</label>
          <input type="text" placeholder="English, Spanish, Vietnamese" />
          <label>Cost Structure</label>
      <div className="tags">
              <span className="tag">Free (No Insurance Required)</span>
              <span className="tag">Sliding Scale</span>
              <span className="tag">Standard Insurance</span>
      </div>
          <button className="btn-save">Save &amp; Update Public Map</button>
          </div>
        </main>
      </div>
    </>
  );
}