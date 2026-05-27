import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export function ProviderLoginPage() {
    
    const [email, setLoginEmail] = useState('')
    const [password, setLoginPassword] = useState('')
    
    const navigate = useNavigate();

     const handleLogin = async (e) => {
        e.preventDefault()
        setLoginEmail(e.target.Email.value)
        setLoginPassword(e.target.Password.value)
        let thisemail = e.target.Email.value
        let thispassword = e.target.Password.value
        signInWithEmailAndPassword(auth, thisemail, thispassword)
        .then((userCredential) => {
            const user = userCredential.user
        })
        .then(() => {
            navigate('/editclinic')
        })
        .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
        })

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
                                <input name="Email" type="email" id="signin-email" placeholder="name@clinic.org" required />
                            </div>

                            <div className="form-group">
                                <label htmlFor="signin-password">Password</label>
                                <input name="Password" type="password" id="signin-password" placeholder="••••••••" required />
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
