import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.YVP_APP_KEY;
  if (!apiKey) return res.status(500).json({ error: 'YVP_APP_KEY not configured' });

  try {
    const response = await fetch('https://api.youversion.com/v1/bibles?language_ranges[]=en', {
      headers: {
        'X-YVP-App-Key': apiKey,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message });
  }
}
