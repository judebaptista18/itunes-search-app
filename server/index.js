import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/api/search', (req, res) => {
  const { term, offset = '0', limit = '10' } = req.query;

  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  const offsetNum = parseInt(String(offset), 10);
  const limitNum  = parseInt(String(limit),  10);

  const itunesUrl =
    `https://itunes.apple.com/search` +
    `?term=${encodeURIComponent(String(term))}` +
    `&limit=100` +
    `&entity=allTrack,album,musicArtist`;

  https.get(itunesUrl, (itunesRes) => {
    let raw = '';
    itunesRes.on('data', (chunk) => { raw += chunk; });
    itunesRes.on('end', () => {
      try {
        const parsed = JSON.parse(raw);

        const sliced = {
          resultCount:  parsed.resultCount,
          totalResults: parsed.results.length,
          results:      parsed.results.slice(offsetNum, offsetNum + limitNum),
        };

        return res.json(sliced);
      } catch (err) {
        console.error('Failed to parse iTunes response:', err);
        return res.status(500).json({ error: 'Failed to parse iTunes response' });
      }
    });
  }).on('error', (err) => {
    console.error('iTunes API error:', err.message);
    return res.status(502).json({ error: 'Failed to reach iTunes API' });
  });
});

// production - Vite outputs to /dist
if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });
  app.use((_req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`Serving build from /dist`);
  }
});