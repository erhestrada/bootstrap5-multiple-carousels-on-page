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

db.run('DROP TABLE IF EXISTS users');
db.run('DROP TABLE IF EXISTS votes');

// need a follows table as well
db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, client_id TEXT, username TEXT UNIQUE, password TEXT)');
db.run('CREATE TABLE IF NOT EXISTS votes (id INTEGER PRIMARY KEY, user_id INTEGER, clip_id TEXT, vote INTEGER, UNIQUE(user_id, clip_id))'); // Each user gets one vote per clip
db.run('CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY, user_id INTEGER, clip_id TEXT)');
db.run('CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, user_id INTEGER, clip_id TEXT, comment TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)');

function getValueFilteredDataFromTable(tableName, columnName, filterValue, res) {
  const query = `SELECT * FROM ${tableName} WHERE ${columnName} = ?`;

  db.all(query, [filterValue], (err, rows) => {
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

function deleteRowFromTable(tableName, columnNames, parameters, res) {
    // e.g. user_id = ? AND clip_id = ?
    const whereClause = columnNames.map(col => `${col} = ?`).join(' AND ');
    const query = `DELETE FROM ${tableName} WHERE ${whereClause}`;

    db.run(query, parameters, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
          return res.status(404).json({ message: `${tableName} not found` });
      }
      res.status(200).json({ message: `${tableName} row removed`, id: this.lastID });
    });
}

function getSignedOutUserId(clientId) {
  return new Promise((resolve, reject) => {
    const query = `SELECT id FROM users WHERE client_id = ? AND username IS NULL LIMIT 1`;

    db.get(query, [clientId], (err, row) => {
      if (err) return reject(err);

      if (row) {
        // Found existing user
        return resolve(row.id);
      }

      // No user found, insert new
      const insert = `INSERT INTO users (client_id, username, password) VALUES (?, NULL, NULL)`;
      db.run(insert, [clientId], function (err) {
        if (err) return reject(err);

        // Insert done, resolve with new ID
        resolve(this.lastID);
      });
    });
  });
}

// ---------------------------- Users ------------------------------
app.get('/signed-out-user-id', (req, res) => {
  const { clientId } = req.query;

  if (!clientId) {
    return res.status(400).json({ error: 'Missing clientId' });
  }

  getSignedOutUserId(clientId).then((userId) => {
    res.status(200).json({ userId });
  }).catch((err) => {
    console.error('Failed to get signed out user:', err);
    res.status(500).json({ error: 'Internal server error' });
  });
});

// ---------------------------- Comments ------------------------------
// this should get all of a user's activity - upvotes downvotes favorites comments follows
app.get('/:userId/activity', (req, res) => {
  res.send('activity endpoint hit');
});

// get all user comments
app.get('/users/:userId/comments', (req, res) => {
  const userId = req.params.userId;
  const tableName = 'comments';
  const columnName = 'user_id';
  const filterValue = userId;
  getValueFilteredDataFromTable(tableName, columnName, filterValue, res);
});

// Get all comments on clip
app.get('/clips/:clipId/comments'), (req, res) => {
  const clipId = req.params.clipId;
  const tableName = 'comments';
  const columnName = 'clip_id';
  const filterValue = clipId;
  getValueFilteredDataFromTable(tableName, columnName, filterValue, res);
}

// Post comment
app.post('/comments', (req, res) => {
  const { userId, clipId, comment } = req.body;

  // const query = 'INSERT INTO comments (user_id, clip_id, comment) VALUES (?, ?, ?)';
  const tableName = 'comments';
  const columnNames = ['user_id', 'clip_id', 'comment'];
  const parameters = [userId, clipId, comment];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// Edit comment
app.put('/comments/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  const { updatedComment } = req.body;

  const query = `UPDATE comments SET comment = ? WHERE id = ?`;
  const parameters = [updatedComment, commentId];

  db.run(query, parameters, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment updated successfully' });
  });
});

// Delete comment
app.delete('/comments', (req, res) => {
  const { userId, clipId, comment } = req.body;

  //const query = 'DELETE FROM favorites WHERE user_id = ? AND clip_id = ?';
  const tableName = 'comments';
  const columnNames = ['user_id', 'clip_id', comment];
  const parameters = [userId, clipId, comment];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});

// ---------------------------- Favorites ------------------------------
app.get('/:userId/favorites', (req, res) => {
  const userId = req.params.userId;
  const tableName = 'favorites';
  const columnName = 'user_id';
  const filterValue = userId;
  getValueFilteredDataFromTable(tableName, columnName, filterValue, res);
});

app.post('/favorites', (req, res) => {
  const { userId, clipId } = req.body;

  // const query = 'INSERT INTO favorites (user_id, clip_id) VALUES (?, ?)';
  const tableName = 'favorites';
  const columnNames = ['user_id', 'clip_id'];
  const parameters = [userId, clipId];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

app.delete('/favorites', (req, res) => {
  const { userId, clipId } = req.body;

  //const query = 'DELETE FROM favorites WHERE user_id = ? AND clip_id = ?';
  const tableName = 'favorites';
  const columnNames = ['user_id', 'clip_id'];
  const parameters = [userId, clipId];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});

// ---------------------------- Votes ------------------------------
// Get all user votes
app.get('/users/:userId/votes', (req, res) => {
  const userId = req.params.userId;
  const tableName = 'votes';
  const columnName = 'user_id';
  const filterValue = userId;
  getValueFilteredDataFromTable(tableName, columnName, filterValue, res);
});

app.get('/votes/:userId/:clipId', (req, res) => {
  const { userId, clipId } = req.params;

  const query = `SELECT vote FROM votes WHERE user_id = ? AND clip_id = ?`;

  db.get(query, [userId, clipId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({ message: 'Vote not found' });
    }

    res.json({ userVoteOnClip: row.vote });
  });
});

// Get upvotes, downvotes, and net votes on a clip
app.get('/votes/:clipId', (req, res) => {
  const clipId = req.params.clipId;

  const query = `SELECT vote FROM votes WHERE clip_id = ?`;

  db.all(query, [clipId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const upvotes = rows.filter(row => row.vote === 'upvote').length;
    const downvotes = rows.filter(row => row.vote === 'downvote').length;
    const netVotes = upvotes - downvotes;

    res.json({ upvotes, downvotes, netVotes });
  });
});

// Post vote
app.post('/votes', async (req, res) => {
  const { userId, clipId, vote } = req.body;
  // const query = 'INSERT INTO comments (user_id, clip_id, comment) VALUES (?, ?, ?)';
  const tableName = 'votes';
  const columnNames = ['user_id', 'clip_id', 'vote'];
  const parameters = [userId, clipId, vote];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// Edit vote
app.put('/votes/:voteId', (req, res) => {
  const voteId = req.params.commentId;
  const { updatedVote } = req.body;

  const query = `UPDATE votes SET vote = ? WHERE id = ?`;
  const parameters = [updatedVote, voteId];

  db.run(query, parameters, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Vote not found' });
    }

    res.json({ message: 'Vote updated successfully' });
  });
});

// Delete vote
app.delete('/votes', (req, res) => {
  const { userId, clipId } = req.body;

  //const query = 'DELETE FROM favorites WHERE user_id = ? AND clip_id = ?';
  const tableName = 'votes';
  const columnNames = ['user_id', 'clip_id'];
  const parameters = [userId, clipId];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});

// ---------------------------- Follows ------------------------------
// Get user follows
app.get('/:userId/follows', (req, res) => {
  const userId = req.params.userId;
  const tableName = 'follows';
  const columnName = 'user_id';
  const filterValue = userId;
  getValueFilteredDataFromTable(tableName, columnName, filterValue, res);
});

/*
// These two need to be tweaked
app.post('/follows', (req, res) => {
  const { userId, clipId, comment } = req.body;

  // const query = 'INSERT INTO follows (user_id, clip_id) VALUES (?, ?)';
  const tableName = 'follows';
  const columnNames = ['user_id', 'clip_id'];
  const parameters = [userId, clipId, comment];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

app.delete('/follows', (req, res) => {
  const { userId, clipId } = req.body;

  //const query = 'DELETE FROM follows WHERE user_id = ? AND clip_id = ?';
  const tableName = 'follows';
  const columnNames = ['user_id', 'clip_id'];
  const parameters = [userId, clipId];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});
*/

// -------------------------------------------------------------------

// Start server
app.listen(port, () => {
  console.log(`Server running on http://192.168.86.195:${port}`);
});