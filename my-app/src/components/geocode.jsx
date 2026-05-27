const BASE_URL = "https://nominatim.openstreetmap.org/search";
const CACHE_KEY = "geocode_cache";

function loadCache() {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY) ?? "{}");
    } catch {
        return {};
    }
}

function saveCache(cache) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    } catch {
        // localStorage full or unavailable — fail silently
    }
}

// Call this with the full list of active addresses to prune stale cache entries
export function pruneCache(activeAddresses) {
    const cache = loadCache();
    const activeSet = new Set(activeAddresses);
    let changed = false;

    for (const key of Object.keys(cache)) {
        if (!activeSet.has(key)) {
            delete cache[key];
            changed = true;
        }
    }

    if (changed) saveCache(cache);
}

export async function geocodeAddress(address) {
    const cache = loadCache();

    // Return cached result if we have it
    if (cache[address]) return cache[address];

    // Build the Nominatim URL first (unencoded address, let fetch handle it)
    const nominatimUrl = `${BASE_URL}?q=${encodeURIComponent(address)}&format=json`;

    // Pass the full Nominatim URL to allorigins — encode it once here
    const proxiedUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(nominatimUrl)}`;

    try {
        const res = await fetch(proxiedUrl);
        const wrapper = await res.json();
        const data = JSON.parse(wrapper.contents);
        const result = data[0] ?? null;

        // Save to cache regardless of result (even null) to avoid re-fetching
        if (result) {
            cache[address] = result;
            saveCache(cache);
        }

        return result;
    } catch (err) {
        console.error("Geocoding failed for:", address, err);
        return null;
    }
}
