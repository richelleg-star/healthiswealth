import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

function handleLanguageChange(e) {
    const lang = e.target.value;

    if (lang === 'en') {
        localStorage.removeItem('preferredLanguage');
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
        window.location.reload();
        return;
    }

    localStorage.setItem('preferredLanguage', lang);

    const tryTranslate = (attempts = 0) => {
        const googSelect = document.querySelector('.goog-te-combo');
        if (googSelect) {
            googSelect.value = lang;
            googSelect.dispatchEvent(new Event('change'));
        } else if (attempts < 10) {
            setTimeout(() => tryTranslate(attempts + 1), 300);
        }
    };
    tryTranslate();
}

export function ProviderBar() {
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('preferredLanguage');
        if (!saved || saved === 'en') return;

        const select = document.querySelector('[aria-label="Select Language"]');
        if (select) select.value = saved;

        const tryTranslate = (attempts = 0) => {
            const googSelect = document.querySelector('.goog-te-combo');
            if (googSelect) {
                googSelect.value = saved;
                googSelect.dispatchEvent(new Event('change'));
            } else if (attempts < 10) {
                setTimeout(() => tryTranslate(attempts + 1), 300);
            }
        };
        tryTranslate();
    }, []);

    function handleLogout() {
        const auth = getAuth();
        signOut(auth)
            .then(() => navigate("/providerlogin"))
            .catch((error) => console.error("Sign out error:", error));
    }

    return (
        <header>
            <div className="logo">
                <img
                    src="/clover_icon.png"
                    alt="HealthIsWealth logo"
                    style={{ height: '36px', width: 'auto' }}
                />
                HealthIs<span>Wealth</span>
            </div>
            <nav>
                <NavLink to="/editclinic">
                    {({ isActive }) => (
                        <span className={isActive ? "active" : ""}>Add / Edit Clinic</span>
                    )}
                </NavLink>
                <NavLink to="/addevent">
                    {({ isActive }) => (
                        <span className={isActive ? "active" : ""}>Add / Edit Event</span>
                    )}
                </NavLink>
                <button
                    onClick={() => window.open('/homepage', '_blank')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        fontWeight: '500',
                        fontFamily: 'inherit',
                        fontSize: '0.9rem',
                        padding: '0',
                        paddingBottom: '0.25rem',
                        borderBottom: '2px solid transparent',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = 'var(--primary)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                    Client View ↗
                </button>
                <div className="language-selector">
                    <svg className="globe-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    <select aria-label="Select Language" onChange={handleLanguageChange}>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="es">Español</option>
                        <option value="vi">Tiếng Việt</option>
                        <option value="zh-CN">中文</option>
                        <option value="so">Soomaali</option>
                    </select>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '0.4rem 1rem',
                        fontFamily: 'inherit',
                        fontWeight: '500',
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.target.style.color = '#ef4444'; e.target.style.borderColor = '#ef4444'; }}
                    onMouseLeave={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.borderColor = 'var(--border)'; }}
                >
                    Log Out
                </button>
            </nav>
        </header>
    );
}