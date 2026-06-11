export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const apiKey = process.env.COTIZAVE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'COTIZAVE_API_KEY is not defined in environment variables' 
      });
    }
    const apiRes = await fetch('https://api.cotizave.com/v1/fx/rates', {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ 
        error: `Cotizave API returned status ${apiRes.status}` 
      });
    }

    const data = await apiRes.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
