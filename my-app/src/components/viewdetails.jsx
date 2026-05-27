import { createPortal } from "react-dom";

export function ViewDetails(props) {
    return (
        <button
            className="btn btn-outline"
            onClick={() => props.onViewDetails(props.clinicinfo)}
        >
            View Details
        </button>
    );
}

// Formats "2026-07-25T12:00" → "July 25th, 2026 @ 12:00 PM"
function formatEventTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const suffix = (d) => {
        if (d > 3 && d < 21) return "th";
        return ["th", "st", "nd", "rd"][d % 10] || "th";
    };
    return `${month} ${day}${suffix(day)}, ${year} @ ${time}`;
}

// Handles both boolean true and string "true"
function isTrue(val) {
    return val === true || val === "true";
}

// Normalizes Firebase arrays-as-objects OR real arrays into a proper array
function toArray(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return Object.values(val);
}

export function DetailsModal({ selectedItem, onClose }) {
    if (!selectedItem) return null;

    const isEvent = Boolean(selectedItem["Date Start"]);

    const branches = toArray(selectedItem.branches);
    const altInsurance = toArray(selectedItem.AltInsurance);
    const tags = toArray(selectedItem.Tags);
    const needApt = isTrue(selectedItem.needapt);

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>

                <h2>{selectedItem.Name}</h2>

                <div className="verified">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Verified 2 days ago
                </div>

                <span className="badge free">{selectedItem.freeOrLowCost}</span>

                {/* Address */}
                <div className="info-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {selectedItem.Address}
                </div>

                {/* ── EVENT-ONLY FIELDS ── */}
                {isEvent && (
                    <>
                        {/* Date & Time */}
                        <div className="info-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="16" rx="2"/>
                                <path d="M16 2v4M8 2v4M3 10h18"/>
                            </svg>
                            {formatEventTime(selectedItem["Date Start"])} – {formatEventTime(selectedItem["Date End"])}
                        </div>

                        {/* Walk-in / Appointment */}
                        <div className="info-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            {needApt ? "Appointment Required" : "Walk-in Accepted"}
                        </div>

                        {/* Language Spoken */}
                        {selectedItem["Language Spoken"] && (
                            <div className="info-row">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                </svg>
                                {selectedItem["Language Spoken"]}
                            </div>
                        )}
                    </>
                )}

                {/* ── CLINIC-ONLY FIELDS ── */}
                {!isEvent && (
                    <>
                        {/* Hours */}
                        <div className="info-row">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="16" rx="2"/>
                                <path d="M16 2v4M8 2v4M3 10h18"/>
                            </svg>
                            {selectedItem.Time || selectedItem.hours}
                        </div>

                        {/* Insurance / Payment Options */}
                        {altInsurance.length > 0 && (
                            <div className="info-section">
                                <h4>Insurance / Payment Options</h4>
                                <ul>
                                    {altInsurance.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Branches */}
                        {branches.length > 0 && (
                            <div className="info-section">
                                <h4>Locations</h4>
                                {branches.map((branch, i) => (
                                    <div key={i} className="branch-card">
                                        <strong>{branch.Name}</strong>

                                        <div className="info-row">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                                <circle cx="12" cy="10" r="3"/>
                                            </svg>
                                            {branch.Address}
                                        </div>

                                        {branch.hours && (
                                            <div className="info-row">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="4" width="18" height="16" rx="2"/>
                                                    <path d="M16 2v4M8 2v4M3 10h18"/>
                                                </svg>
                                                {branch.hours}
                                            </div>
                                        )}

                                        {branch.notes && (
                                            <div className="info-row branch-notes">
                                                <em>{branch.notes}</em>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ── SHARED FIELDS ── */}

                {/* Notes */}
                {selectedItem.notes && (
                    <div className="info-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        {selectedItem.notes}
                    </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                    <div className="tags">
                        {tags.map((tag, i) => (
                            <span key={i} className="tag">{tag}</span>
                        ))}
                    </div>
                )}

                {/* Website Link */}
                {selectedItem.link && (
                    <div className="info-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                        </svg>
                        <a href={selectedItem.link} target="_blank" rel="noopener noreferrer">
                            Visit Website
                        </a>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
