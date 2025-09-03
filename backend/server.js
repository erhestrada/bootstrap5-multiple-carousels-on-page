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


function getUserData(tableName, userId, res) {
  const query = `SELECT * FROM ${tableName} WHERE user_id = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

// ---------------------------- Comments ------------------------------
// this should get all of a user's activity - upvotes downvotes favorites comments follows
app.get('/:userId/activity', (req, res) => {
  res.send('activity endpoint hit');
});

app.get('/:userId/comments', (req, res) => {
  const userId = req.params.userId;
  getUserData('comments', userId, res);
});

app.post('/comments', (req, res) => {
  const { userId, clipId, comment } = req.body;

  const query = 'INSERT INTO comments (user_id, clip_id, comment) VALUES (?, ?, ?)';
  const parameters = [userId, clipId, comment];

  // Use a regular function instead of arrow function so this refers to db
  db.run(query, parameters, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Comment added', id: this.lastID });
  });
});

// ---------------------------- Favorites ------------------------------
app.get('/:userId/favorites', (req, res) => {
  const userId = req.params.userId;
  const query = 'SELECT * FROM favorites WHERE user_id = ?';
  getUserData('favorites', userId, res);
});

app.post('/favorites', (req, res) => {
  const { userId, clipId, comment } = req.body;

  const query = 'INSERT INTO favorites (user_id, clip_id) VALUES (?, ?)';
  const parameters = [userId, clipId, comment];

  // Use a regular function instead of arrow function so this refers to db
  db.run(query, parameters, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Comment added', id: this.lastID });
  });
});


// Start server
app.listen(port, () => {
  console.log(`Server running on http://192.168.86.195:${port}`);
});