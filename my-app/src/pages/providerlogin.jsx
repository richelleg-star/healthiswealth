import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export function ProviderLoginPage() {
    const [showSignup, setShowSignup] = useState(false);
    const navigate = useNavigate();
    function handleLogin(event) {
        event.preventDefault();
        navigate("/editclinic");
    }
    function handleSignup(event) {
        event.preventDefault();
        navigate("/addevent");
    }
    function switchForm() {
        setShowSignup(!showSignup);
    }
    return (
        <div className="auth-container">
            <div className="auth-banner">
                <h1>Partner with HealthIsWealth</h1>
                <p>Claim your clinic's listing to ensure the community has accurate, real-time access to your safety-net services.</p>

                <ul className="feature-list">
                    <li>✓ Instantly update walk-in availability</li>
                    <li>✓ Clarify cost and language support</li>
                    <li>✓ Reduce patient confusion and missed care</li>
                </ul>
            </div>

            <div className="auth-form-wrapper">
                <div className="auth-card">
                    <NavLink to="/homepage" className="logo">
                        HealthIs<span>Wealth</span>
                    </NavLink>

                    {!showSignup ? (
                        <div id="signin-form">
                            <div className="auth-header">
                                <h2>Provider Sign In</h2>
                                <p>Welcome back! Manage your clinic's details.</p>
                            </div>

                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label htmlFor="signin-email">Work Email Address</label>
                                    <input type="email" id="signin-email" placeholder="name@clinic.org" required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="signin-password">Password</label>
                                    <input type="password" id="signin-password" placeholder="••••••••" required />
                                    <div className="forgot-link">
                                        <a href="#">Forgot password?</a>
                                    </div>
                                </div>

                                <button type="submit" className="btn-submit">
                                    Sign In to Dashboard
                                </button>
                            </form>

                            <div className="auth-switch">
                                Don&apos;t have a provider account?{" "}
                                <button type="button" onClick={switchForm}>
                                    Register your clinic
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div id="signup-form">
                            <div className="auth-header">
                                <h2>Register Your Clinic</h2>
                                <p>Create an account to verify and manage your public listing.</p>
                            </div>

                            <form onSubmit={handleSignup}>
                                <div className="form-group">
                                    <label htmlFor="signup-clinic">Clinic / Organization Name</label>
                                    <input type="text" id="signup-clinic" placeholder="e.g. Rainier Beach Medical Clinic" required />
                                </div>

                                <div className="name-row">
                                    <div className="form-group">
                                        <label htmlFor="signup-first">First Name</label>
                                        <input type="text" id="signup-first" required />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="signup-last">Last Name</label>
                                        <input type="text" id="signup-last" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="signup-email">Official Work Email</label>
                                    <input type="email" id="signup-email" placeholder="Must match clinic domain" required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="signup-password">Create Password</label>
                                    <input type="password" id="signup-password" placeholder="Min. 8 characters" required />
                                </div>

                                <button type="submit" className="btn-submit">
                                    Create Provider Account
                                </button>
                            </form>

                            <div className="auth-switch">
                                Already registered?{" "}
                                <button type="button" onClick={switchForm}>
                                    Sign in here
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// style="text-align: right; margin-top: 0.5rem;"
// style="font-size: 0.85rem; color: var(--primary); text-decoration: none;"
// style="display: flex; gap: 1rem;"
// style="flex: 1;"
// style="flex: 1;"
