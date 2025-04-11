const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// ✅ Serve your HTML file at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // make sure this matches your HTML file name!
});

// 📁 Make sure data.json exists in the same folder, or create it manually as an empty array:
// []

// Read database
function readDB() {
  if (!fs.existsSync(DB_PATH)) return [];
  const data = fs.readFileSync(DB_PATH);
  return JSON.parse(data);
}

// Write database
function writeDB(entries) {
  fs.writeFileSync(DB_PATH, JSON.stringify(entries, null, 2));
}

// GET all entries
app.get('/api/entries', (req, res) => {
  const entries = readDB();
  res.json(entries);
});

// POST new entry
app.post('/api/entries', (req, res) => {
  const { username, microscopeSize, magnification } = req.body;

  if (!username || !microscopeSize || !magnification) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  const actualSize = microscopeSize / magnification;
  const newEntry = { username, microscopeSize, magnification, actualSize };
  const entries = readDB();
  entries.push(newEntry);
  writeDB(entries);

  res.status(201).json(newEntry);
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
