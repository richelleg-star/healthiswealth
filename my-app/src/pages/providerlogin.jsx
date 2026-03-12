import React from "react";

export function ProviderLoginPage(){
    return(
    <div className="auth-container">
        <div className="auth-banner">
            <h1>Partner with HealthIsWealth</h1>
            <p>Claim your clinic's listing to ensure the community has accurate, real-time access to your safety-net services.</p>
            
            <ul className="feature-list">
                <li>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Instantly update walk-in availability
                </li>
                <li>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Clarify cost and language support
                </li>
                <li>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Reduce patient confusion and missed care
                </li>
            </ul>
        </div>
        <div className="auth-form-wrapper">
            <div className="auth-card">
                
                <a href="static_mockup.html" className="logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    HealthIs<span>Wealth</span>
                </a>

                <div id="signin-form">
                    <div className="auth-header">
                        <h2>Provider Sign In</h2>
                        <p>Welcome back! Manage your clinic's details.</p>
                    </div>

                    <form onSubmit="event.preventDefault(); window.location.href='static_mockup.html';">
                        <div className="form-group">
                            <label htmlFor="signin-email">Work Email Address    </label>
                            <input type="email" id="signin-email" placeholder="name@clinic.org" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="signin-password">Password</label>
                            <input type="password" id="signin-password" placeholder="••••••••" required/>
                            <div>
                                <a href="#">Forgot password?</a>
                            </div>
                        </div>
                        
                        <button type="submit" className="btn-submit">Sign In to Dashboard</button>
                    </form>

                    <div className="auth-switch">
                        Don't have a provider account? <a onClick="toggleForms()">Register your clinic</a>
                    </div>
                </div>

                <div id="signup-form">
                    <div className="auth-header">
                        <h2>Register Your Clinic</h2>
                        <p>Create an account to verify and manage your public listing.</p>
                    </div>

                    <form onSubmit="event.preventDefault(); window.location.href='static_mockup.html';">
                        <div className="form-group">
                            <label htmlFor="signup-clinic">Clinic / Organization Name</label>
                            <input type="text" id="signup-clinic" placeholder="e.g. Rainier Beach Medical Clinic" required/>
                        </div>
                        <div >
                            <div className="form-group" >
                                <label htmlFor="signup-first">First Name</label>
                                <input type="text" id="signup-first" required/>
                            </div>
                            <div className="form-group" >
                                <label htmlFor="signup-last">Last Name</label>
                                <input type="text" id="signup-last" required/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="signup-email">Official Work Email</label>
                            <input type="email" id="signup-email" placeholder="Must match clinic domain" required/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="signup-password">Create Password</label>
                            <input type="password" id="signup-password" placeholder="Min. 8 characters" required/>
                        </div>
                        
                        <button type="submit" className="btn-submit">Create Provider Account</button>
                    </form>

                    <div className="auth-switch">
                        Already registered? <a onClick="toggleForms()">Sign in here</a>
                    </div>
                </div>

            </div>
        </div>
    </div>
    )
}

// style="text-align: right; margin-top: 0.5rem;"
// style="font-size: 0.85rem; color: var(--primary); text-decoration: none;"
// style="display: flex; gap: 1rem;"
// style="flex: 1;"
// style="flex: 1;"