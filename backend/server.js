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
  //db.run('DROP TABLE IF EXISTS comments');
  db.run('DROP TABLE IF EXISTS followed_streamers');
  db.run('DROP TABLE IF EXISTS followed_categories');

  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, client_id TEXT, username TEXT UNIQUE, password TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS votes (id INTEGER PRIMARY KEY, user_id INTEGER, clip_id TEXT, vote INTEGER, UNIQUE(user_id, clip_id), FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)'); // Each user gets one vote per clip
  db.run('CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY, user_id INTEGER, clip_id TEXT, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)');
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY,
    clip_id TEXT,
    user_id INTEGER,
    parent_id INTEGER,
    comment TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(parent_id) REFERENCES comments(id))
    `);
  db.run('CREATE TABLE IF NOT EXISTS followed_streamers (id INTEGER PRIMARY KEY, user_id INTEGER, streamer TEXT, twitch_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)');
  db.run('CREATE TABLE IF NOT EXISTS followed_categories (id INTEGER PRIMARY KEY, user_id INTEGER, category TEXT, twitch_id INTEGER, box_art_url TEXT, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)');

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
    console.log('function running');
    db.run(query, parameters, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) {
          return res.status(404).json({ message: `${tableName} not found` });
      }
      
      console.log(`Deleted ${this.changes} row(s) from ${tableName} with params:`, parameters);
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

function nestComments(flatComments) {
    const commentsById = {};
    const nestedComments = [];

    // Give each comment a replies property and store comments in commentsById
    flatComments.forEach(comment => {
        comment.replies = [];
        commentsById[comment.id] = comment;
    });

    // Populate nestedComments; all comments are either a parent (no parent_id) or a reply (has a parent_id)
    flatComments.forEach(comment => {
        if (comment.parent_id) {
            const parent = commentsById[comment.parent_id];
            if (parent) {
                parent.replies.push(comment);
            }
        } else {
            nestedComments.push(comment);
        }
    });

    return nestedComments;
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
app.get('/clips/:clipId/comments', (req, res) => {
    const clipId = req.params.clipId;

    const query = `SELECT * FROM comments WHERE clip_id = ? ORDER BY timestamp ASC`;

    db.all(query, [clipId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const nestedComments = nestComments(rows);
        res.json(nestedComments);
    });
});

// Post comment
app.post('/clips/:clipId/comments', (req, res) => {
  const { clipId } = req.params;
  const { userId, parentId, comment } = req.body;

  const tableName = 'comments';
  const columnNames = ['clip_id', 'user_id', 'parent_id', 'comment'];
  const parameters = [clipId, userId, parentId, comment];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// Delete comment
app.delete('/clips/:clipId/comments', (req, res) => {
  const { clipId } = req.params;
  const { userId, parentId, comment } = req.body;

  const tableName = 'comments';
  const columnNames = ['clip_id', 'user_id', 'comment'];
  const parameters = [clipId, userId, comment];

  deleteRowFromTable(tableName, columnNames, parameters, res);
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
// Get all user follows - followed streamers and followed categories
app.get('/users/:id/following', (req, res) => {
  const { id: userId } = req.params;

  const streamersQuery = `SELECT streamer, twitch_id FROM followed_streamers WHERE user_id = ?`;
  const categoriesQuery = `SELECT category, twitch_id, box_art_url FROM followed_categories WHERE user_id = ?`;

  db.all(streamersQuery, [userId], (err, streamerRows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    db.all(categoriesQuery, [userId], (err, categoryRows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ streamers: streamerRows, categories: categoryRows });
    });
  });
});

// Get user follows of a specific kind e.g. followed streamers or followed categories
app.get('/users/:id/following/:kind', (req, res) => {
  const { id: userId, kind } = req.params;

  let tableName, title;
  if (kind === 'streamers') {
    tableName = 'followed_streamers';
    title = 'streamer';
  } else if (kind === 'categories') {
    tableName = 'followed_categories';
    title = 'category';
  } else {
    return res.status(400).json({ error: 'Invalid kind' });
  }

  const columnName = 'user_id';
  const filterValue = userId;

  const query = `SELECT * FROM ${tableName} WHERE ${columnName} = ?`;

  db.all(query, [filterValue], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const follows = rows.map(row => row[title]);
    res.json({ [kind]: follows });
  });
});

// Post streamer to follow
app.post('/users/:userId/following/streamers/:streamer', (req, res) => {
  const { userId, streamer } = req.params;
  const { twitchId } = req.body

  const tableName = 'followed_streamers';
  const columnNames = ['user_id', 'streamer', 'twitch_id'];
  const parameters = [userId, streamer, twitchId];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// Delete followed streamer
app.delete('/users/:userId/following/streamers/:streamer', (req, res) => {
  const { userId, streamer } = req.params;
  const { twitchId } = req.body

  const tableName = 'followed_streamers';
  const columnNames = ['user_id', 'streamer', 'twitch_id'];
  const parameters = [userId, streamer, twitchId];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});

// Post category to follow
app.post('/users/:userId/following/categories/:category', (req, res) => {
  const { userId, category } = req.params
  const { twitchId, boxArtUrl } = req.body;

  const tableName = 'followed_categories';
  const columnNames = ['user_id', 'category', 'twitch_id', 'box_art_url'];
  const parameters = [userId, category, twitchId, boxArtUrl];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// Delete followed category
app.delete('/users/:userId/following/categories/:category', (req, res) => {
  const { userId, category } = req.params
  const { twitchId, boxArtUrl } = req.body;

  const tableName = 'followed_categories';
  const columnNames = ['user_id', 'category', 'twitch_id', 'box_art_url'];
  const parameters = [userId, category, twitchId, boxArtUrl];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});
// -------------------------------------------------------------------

// Start server
app.listen(port, () => {
  console.log(`Server running on http://192.168.86.195:${port}`);
});