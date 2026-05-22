import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set as fireSet } from "firebase/database";

export function ProviderSignupPage() {
    const [clinic, setClinic] = useState('')
    const [email, setEmail] = useState('')
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        const re = /^[0-9\b]+$/
        // alert stuff -> shows alerts if everything is empty
        if (
            clinic.length == 0 ||
            firstname.length == 0 ||
            lastname.length == 0 ||
            email.length == 0 ||
            phone.length == 0 ||
            password.length == 0
        ) {
        //     showAlert('One or more of your fields is currently empty')
        // }
        // else if (phone.length < 10 || phone.length > 10 || re.test(phone) == false) {
        //     showAlert('Invalid Phone Number; please do not put dashes')
        }
        else
        {
        // authentication
        const auth = getAuth()
        const theEmail = email
        const thePassword = password
        const handleUserCreation = async (imgDataUrl = '') => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, theEmail, thePassword);
            const user = userCredential.user;
            const db = getDatabase();
            const userRef = ref(db, 'users/' + user.uid);

            await fireSet(userRef, {
                clinic: clinic,
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                img: imgDataUrl,
                email: email,
            });

            navigate('/addevent');
        } catch (error) {
            console.log(error.code, error.message);
        }
    }

    // If image file is present, read it and wait for FileReader
    handleUserCreation();

    }
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

                    <div id="signup-form">
                        <div className="auth-header">
                            <h2>Register Your Clinic</h2>
                            <p>Create an account to verify and manage your public listing.</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="signup-clinic">Clinic / Organization Name</label>
                                <input
                                    type="text"
                                    id="signup-clinic"
                                    placeholder="e.g. Rainier Beach Medical Clinic"
                                    value={clinic}
                                    onChange={(e) => setClinic(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="name-row">
                                <div className="form-group">
                                    <label htmlFor="signup-first">First Name</label>
                                    <input
                                        type="text"
                                        id="signup-first"
                                        value={firstname}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="signup-last">Last Name</label>
                                    <input
                                        type="text"
                                        id="signup-last"
                                        value={lastname}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="signup-phone">Phone Number</label>
                                <input
                                    type="text"
                                    id="signup-phone"
                                    placeholder="10 digits, no dashes"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="signup-email">Official Work Email</label>
                                <input
                                    type="email"
                                    id="signup-email"
                                    placeholder="Must match clinic domain"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="signup-password">Create Password</label>
                                <input
                                    type="password"
                                    id="signup-password"
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-submit">
                                Create Provider Account
                            </button>
                        </form>

                        <div className="auth-switch">
                            Already registered?{" "}
                            <NavLink to="/providerlogin">Sign in here</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
