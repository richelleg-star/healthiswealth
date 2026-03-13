import React from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";

export function LoggedOutProviderBar(){
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
                        <select aria-label="Select Language">
                            <svg className="globe-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                            <option value="en">English</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="vi">Tiếng Việt</option>
                            <option value="zh">中文</option>
                            <option value="so">Soomaali</option>
                        </select>
                    </div>
                </nav>
        </>
    )
    
}