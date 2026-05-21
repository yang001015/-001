const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = process.env.PORT || 3000;

app.use(require('cors')());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serve static files (admin.html, index.html)

function readData() {
  try {
    const txt = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(txt || '[]');
  } catch (e) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/items', (req, res) => {
  const data = readData();
  const q = String(req.query.q || '').trim().toLowerCase();
  if (!q) {
    return res.json(data);
  }

  const filtered = data.filter(item => {
    return [item.word, item.translation, item.partOfSpeech, item.example, item.rootAnalysis]
      .some(value => typeof value === 'string' && value.toLowerCase().includes(q));
  });

  res.json(filtered);
});

app.post('/api/items', (req, res) => {
  const item = req.body;
  if (!item || !item.word) return res.status(400).json({ error: 'invalid payload' });
  const data = readData();
  data.push(item);
  writeData(data);
  res.status(201).json(item);
});

app.listen(PORT, () => {
  console.log(`API + static server listening on http://localhost:${PORT}`);
});
