export async function handler(event) {
    const { address } = event.queryStringParameters;
    const encoded = encodeURIComponent(address);
    
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encoded}&format=json`, {
        headers: { 'User-Agent': 'healthiswealth/1.0' }
    });
    const data = await res.json();
    
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
}