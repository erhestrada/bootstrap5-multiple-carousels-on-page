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

db.serialize(() => {
  db.run('DROP TABLE IF EXISTS users');
  db.run('DROP TABLE IF EXISTS votes');
  db.run('DROP TABLE IF EXISTS follows');
  db.run('DROP TABLE IF EXISTS followed_streamers');
  db.run('DROP TABLE IF EXISTS followed_categories');

  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, client_id TEXT, username TEXT UNIQUE, password TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS votes (id INTEGER PRIMARY KEY, user_id INTEGER, clip_id TEXT, vote INTEGER, UNIQUE(user_id, clip_id), FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)'); // Each user gets one vote per clip
  db.run('CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY, user_id INTEGER, clip_id TEXT, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)');
  db.run('CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY, user_id INTEGER, clip_id TEXT, comment TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)');
  db.run('CREATE TABLE IF NOT EXISTS followed_streamers (id INTEGER PRIMARY KEY, user_id INTEGER, streamer TEXT, twitch_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)');
  db.run('CREATE TABLE IF NOT EXISTS followed_categories (id INTEGER PRIMARY KEY, user_id INTEGER, category TEXT, twitch_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)');

});

function getValueFilteredDataFromTable(tableName, columnName, filterValue, res) {
  const query = `SELECT * FROM ${tableName} WHERE ${columnName} = ?`;

  db.all(query, [filterValue], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

function insertRowIntoTable(tableName, columnNames, parameters, res) {
  const query = `INSERT INTO ${tableName} (${columnNames.join(', ')}) VALUES (${columnNames.map(() => '?').join(', ')})`;

  db.run(query, parameters, function (err) {
    if (err) {
      console.error(`Error inserting into ${tableName}:`, err);  // <- this line is key
      return res.status(500).json({ error: err.message });
    }

    console.log(`Inserted row into ${tableName} with ID:`, this.lastID);
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

// Get favorite status of clip
app.get('/favorites/:userId/:clipId', (req, res) => {
  const { userId, clipId } = req.params;

  const query = `SELECT * FROM favorites WHERE user_id = ? AND clip_id = ?`;

  db.get(query, [userId, clipId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.json({ favorited: false });
    }

    res.json({ favorited: true });
  });
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
      return res.json({ userVoteOnClip: null });
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
app.get('/users/:id/following', (req, res) => {
  const userId = req.params.userId;
  const tableName = 'follows';
  const columnName = 'user_id';
  const filterValue = userId;

  const query = `SELECT * FROM ${tableName} WHERE ${columnName} = ?`;

  db.all(query, [filterValue], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!rows) {
      return res.json({'streamers': [], 'categories': []});
    }

    const streamerFollows = rows.filter(row => row.kind === 'streamer');
    const categoryFollows = rows.filter(row => row.kind === 'category');
    const follows = {'streamers': streamerFollows, 'categories': categoryFollows};

    res.json(follows);
  });
});

// Post streamer to follow
app.post('/users/:userId/following/streamers/:streamer/:twitchId', (req, res) => {
  const { userId, streamer, twitchId } = req.params;

  const tableName = 'followed_streamers';
  const columnNames = ['user_id', 'streamer', 'twitch_id'];
  const parameters = [userId, streamer, twitchId];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// Delete followed streamer
app.delete('/users/:userId/following/streamers/:streamer/:twitchId', (req, res) => {
  const { userId, streamer, twitchId } = req.params;

  const tableName = 'followed_streamers';
  const columnNames = ['user_id', 'streamer', 'twitch_id'];
  const parameters = [userId, streamer, twitchId];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});

// Post category to follow
app.post('/users/:userId/following/categories/:category/:twitchId', (req, res) => {
  const { userId, category, twitchId } = req.params;

  const tableName = 'followed_categories';
  const columnNames = ['user_id', 'category', 'twitch_id'];
  const parameters = [userId, category, twitchId];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// Delete followed category
app.delete('/users/:userId/following/categories/:category/:twitchId', (req, res) => {
  const { userId, category, twitchId } = req.params;

  const tableName = 'followed_categories';
  const columnNames = ['user_id', 'category', 'twitch_id'];
  const parameters = [userId, category, twitchId];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});
// -------------------------------------------------------------------

// Start server
app.listen(port, () => {
  console.log(`Server running on http://192.168.86.195:${port}`);
});