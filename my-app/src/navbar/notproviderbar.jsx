import React from "react";
import { Link, useNavigate, NavLink } from "react-router";

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