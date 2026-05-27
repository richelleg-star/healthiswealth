// Extracts the first 5-digit zip code from an address string.
// e.g. "4238 Auburn Wy N Auburn, WA 98002" → "98002"
export function extractZip(address = "") {
    const match = address.match(/\b\d{5}\b/);
    return match ? match[0] : null;
}

// Filters clinics by zip code.
// - Clinics with a normal address: match if the address contains the zip
// - Clinics with "Multiple Locations": match if ANY branch address contains the zip
// - If no zip is entered, returns all clinics
export function filterClinicsByZip(clinics, zip) {
    if (!zip) return clinics;

    return clinics.filter(([, info]) => {
        const topZip = extractZip(info.Address);

        // Has a real top-level address
        if (topZip) return topZip === zip;

        // "Multiple Locations" — check branches
        if (info.branches) {
            return Object.values(info.branches).some(
                (branch) => extractZip(branch.Address) === zip
            );
        }

        return false;
    });
}

// Filters events by zip code.
// Events always have a single address, so just match directly.
// If no zip is entered, returns all events.
export function filterEventsByZip(events, zip) {
    if (!zip) return events;

    return events.filter(([, info]) => extractZip(info.Address) === zip);
}
