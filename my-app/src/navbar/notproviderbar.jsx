import React, { useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";

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

export function LoggedOutProviderBar(){

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

    return(
        <>
                <div className="logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    HealthIs<span>Wealth</span>
                </div>
                <nav>

                <NavLink to="/homepage">
                    {({ isActive }) => (
                        <span className={isActive ? "active" : ""}>Find Care</span>
                    )}
                </NavLink>
                <NavLink to="/healthevents">
                    {({ isActive }) => (
                        <span className={isActive ? "active" : ""}>Health Events</span>
                    )}
                </NavLink>
                <NavLink to="/providerlogin">
                    {({ isActive }) => (
                        <span className={isActive ? "active" : ""}>Provider Login</span>
                    )}
                </NavLink>
                    <div className="language-selector">
                        <svg className="globe-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        <select aria-label="Select Language" onChange={handleLanguageChange}>
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="vi">Tiếng Việt</option>
                            <option value="zh-CN">中文</option>
                            <option value="so">Soomaali</option>
                        </select>
                    </div>
                </nav>
        </>
    )
}