import express from 'express';
import cors from 'cors';
import sqlite3Pkg from 'sqlite3'; // import with a different name

const sqlite3 = sqlite3Pkg.verbose(); // enable detailed error tracking

const app = express();
const port = 3000;  // Change to a different port

app.use(cors({
  origin: true,  // This allows all origins
  credentials: true
}));

// Enable Express middleware to parse incoming JSON request bodies
app.use(express.json());

// Setup SQLite database
const db = new sqlite3.Database('./data.db');



//db.run('DROP TABLE comments');

db.run('CREATE TABLE IF NOT EXISTS upvotes (id INTEGER PRIMARY KEY, user_id INTEGER, clip_id INTEGER)');
db.run('CREATE TABLE IF NOT EXISTS downvotes (id INTEGER PRIMARY KEY, user_id INTEGER, clip_id INTEGER)');
db.run('CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY, user_id INTEGER, clip_id INTEGER)');
db.run('CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, user_id INTEGER, clip_id INTEGER, comment TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)');


function getUserDataFromTable(userId, tableName, res) {
  const query = `SELECT * FROM ${tableName} WHERE user_id = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

function insertRowIntoTable(tableName, columnNames, parameters, res) {
  // e.g.'INSERT INTO comments (user_id, clip_id, comment) VALUES (?, ?, ?)'; 1 ? per column
  const query = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${columnNames.map(() => '?').join(', ')})`;

  // Use a regular function instead of arrow function so this refers to db
  db.run(query, parameters, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: `Row added to ${tableName}`, id: this.lastID });
  });
}

// ---------------------------- Comments ------------------------------
// this should get all of a user's activity - upvotes downvotes favorites comments follows
app.get('/:userId/activity', (req, res) => {
  res.send('activity endpoint hit');
});

app.get('/:userId/comments', (req, res) => {
  const userId = req.params.userId;
  getUserDataFromTable(userId, 'comments', res);
});

app.post('/comments', (req, res) => {
  const { userId, clipId, comment } = req.body;

  // const query = 'INSERT INTO comments (user_id, clip_id, comment) VALUES (?, ?, ?)';
  const tableName = 'comments';
  const columnNames = ['user_id', 'clip_id', 'comment'];
  const parameters = [userId, clipId, comment];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// ---------------------------- Favorites ------------------------------
app.get('/:userId/favorites', (req, res) => {
  const userId = req.params.userId;
  getUserDataFromTable(userId, 'favorites', res);
});

app.post('/favorites', (req, res) => {
  const { userId, clipId, comment } = req.body;

  // const query = 'INSERT INTO favorites (user_id, clip_id) VALUES (?, ?)';
  const tableName = 'favorites';
  const columnNames = ['user_id', 'clip_id'];
  const parameters = [userId, clipId, comment];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

app.delete('/favorites', (req, res) => {
  const { userId, clipId } = req.body; // Assuming userId and clipId are passed in the body

  const query = 'DELETE FROM favorites WHERE user_id = ? AND clip_id = ?';
  const parameters = [userId, clipId];

  db.run(query, parameters, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    res.status(200).json({ message: 'Favorite removed', id: this.lastID });
  });
});

// ---------------------------------------------------------------------


// Start server
app.listen(port, () => {
  console.log(`Server running on http://192.168.86.195:${port}`);
});