import { useNavigate, NavLink } from "react-router-dom";

export function ProviderLoginPage() {
    const navigate = useNavigate();

    function handleLogin(event) {
        event.preventDefault();
        navigate("/editclinic");
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
                            <NavLink to="/provider-signup">Register your clinic</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
