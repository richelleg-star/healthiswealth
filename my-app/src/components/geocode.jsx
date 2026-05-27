const BASE_URL = "https://nominatim.openstreetmap.org/search";
const PROXY = "https://corsproxy.io/?";

export async function geocodeAddress(address) {
    const encoded = encodeURIComponent(address);
    const url = `${BASE_URL}?q=${encoded}&format=json`;
    const proxiedUrl = `${PROXY}${encodeURIComponent(url)}`;

    const res = await fetch(proxiedUrl, {
        headers: {
            "User-Agent": `healthiswealth (${import.meta.env.VITE_CONTACT_EMAIL})`
        }
    });

    const data = await res.json();
    return data[0] ?? null;
}
