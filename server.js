const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = process.env.PORT || 3000;

app.use(require('cors')());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serve static files (admin.html, index.html)

const defaultWords = [
  {
    word: 'Abundant',
    translation: '大量的',
    partOfSpeech: 'adj.',
    example: 'The garden has abundant flowers.',
    rootAnalysis: '"Abund" means plenty.'
  },
  {
    word: 'Benevolent',
    translation: '仁慈的',
    partOfSpeech: 'adj.',
    example: 'The benevolent king helped the poor.',
    rootAnalysis: '"Bene" means good, "vol" means will.'
  },
  {
    word: 'Courageous',
    translation: '勇敢的',
    partOfSpeech: 'adj.',
    example: 'The courageous firefighter saved the child.',
    rootAnalysis: '"Cour" means heart.'
  },
  {
    word: 'Diligent',
    translation: '勤奮的',
    partOfSpeech: 'adj.',
    example: 'She is diligent in her studies.',
    rootAnalysis: '"Dilig" means careful.'
  },
  {
    word: 'Eloquent',
    translation: '雄辯的',
    partOfSpeech: 'adj.',
    example: 'The eloquent speaker captivated the audience.',
    rootAnalysis: '"Eloqu" means speak.'
  },
  {
    word: 'Fortunate',
    translation: '幸運的',
    partOfSpeech: 'adj.',
    example: 'I am fortunate to have such friends.',
    rootAnalysis: '"Fortun" means luck.'
  },
  {
    word: 'Generous',
    translation: '慷慨的',
    partOfSpeech: 'adj.',
    example: 'He is generous with his time.',
    rootAnalysis: '"Gener" means kind.'
  },
  {
    word: 'Harmonious',
    translation: '和諧的',
    partOfSpeech: 'adj.',
    example: 'The harmonious music soothed everyone.',
    rootAnalysis: '"Harm" means join.'
  },
  {
    word: 'Industrious',
    translation: '勤勞的',
    partOfSpeech: 'adj.',
    example: 'The industrious bee collected nectar.',
    rootAnalysis: '"Industr" means skill.'
  },
  {
    word: 'Jubilant',
    translation: '歡樂的',
    partOfSpeech: 'adj.',
    example: 'The jubilant crowd cheered loudly.',
    rootAnalysis: '"Jubil" means shout.'
  }
];

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

function getAllWords() {
  const stored = readData();
  const existingWords = new Set(defaultWords.map(item => item.word.toLowerCase()));
  const extraWords = stored.filter(item => item.word && !existingWords.has(item.word.toLowerCase()));
  return [...defaultWords, ...extraWords];
}

app.get('/api/items', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const data = getAllWords();
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
  const existingWords = new Set(data.map(entry => entry.word.toLowerCase()));
  if (existingWords.has(item.word.toLowerCase())) {
    return res.status(409).json({ error: 'word already exists' });
  }

  data.push(item);
  writeData(data);
  res.status(201).json(item);
});

app.listen(PORT, () => {
  console.log(`API + static server listening on http://localhost:${PORT}`);
});
