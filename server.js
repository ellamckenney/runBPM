const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname))); // Serve all root files

// Explicitly serve index.html at /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API proxy route
app.get('/api/search', async (req, res) => {
  const { type, query } = req.query;
  const apiKey = process.env.GETSONG_API_KEY;

  const baseUrl = type === 'bpm'
    ? `https://api.getsong.co/tempo/?bpm=${query}`
    : `https://api.getsong.co/search/?type=song&lookup=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(`${baseUrl}&api_key=${apiKey}`, {
      headers: { Accept: 'application/json' }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'API request failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

