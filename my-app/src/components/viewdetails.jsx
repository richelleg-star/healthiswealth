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
// fix's the mobile bottom-sheet on both iOS Safari and Android Chrome.
export function DetailsModal({ selectedItem, onClose }) {
    if (!selectedItem) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>

                <h2>{selectedItem.Name}</h2>

                <div className="verified">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    Verified 2 days ago
                </div>

                <span className="badge free">{selectedItem.freeOrLowCost}</span>

                <div className="info-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {selectedItem.Address}
                </div>

                <div className="info-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {selectedItem.Time || selectedItem.hours}
                </div>

                {selectedItem.Description && (
                    <div className="info-row">{selectedItem.Description}</div>
                )}

                <div className="tags">
                    {selectedItem.Tags?.map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>,
        document.body
    );
}