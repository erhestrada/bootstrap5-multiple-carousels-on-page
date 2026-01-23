import express from 'express';
import cors from 'cors';
import sqlite3Pkg from 'sqlite3';
import { getRedditPosts } from './getRedditPosts.js';
import { getTwitchAcessToken } from './getTwitchAccessToken.js';
import { clipsRouter, votesRouter, favoritesRouter, usersRouter } from './routes/index.js';
//import { generateNewRandomUsername } from './utils/utils.js'; // TODO: need to pass in db variable for runasyncquery
import { runAsyncQuery } from './utils/runAsyncQuery.js';

// TODO: start moving things to different files

// TODO: connect twitch authtoken from token.json to auth token in ../config.js - the one i'm actually using
// TODO: run getTwitchAccessToken separately from when server starts
// TODO: refactor frontend code that uses clientId, authToken, clientSecret to go through requests to backend
// TODO: instead of calling getTwitchAccessToken once when the server starts, call twitchGet with getTwitchAccessToken() as first line so
    // i'm checking if the twitchAccessToken is up to date every time i make a twitch get request
getTwitchAcessToken();

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
  db.run('DROP TABLE IF EXISTS favorites');
  db.run('DROP TABLE IF EXISTS comments');
  db.run('DROP TABLE IF EXISTS comment_likes');
  db.run('DROP TABLE IF EXISTS history');
  db.run('DROP TABLE IF EXISTS followed_streamers');
  db.run('DROP TABLE IF EXISTS followed_categories');
  db.run('DROP TABLE IF EXISTS clips');

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
  db.run(`CREATE TABLE IF NOT EXISTS comment_likes (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    comment_id INTEGER,
    UNIQUE(user_id, comment_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(comment_id) REFERENCES comments(id))
    `);
  db.run(`CREATE TABLE IF NOT EXISTS history (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  twitch_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)
    `);

  db.run('CREATE TABLE IF NOT EXISTS followed_streamers (id INTEGER PRIMARY KEY, user_id INTEGER, streamer TEXT, twitch_id TEXT, profile_picture_url TEXT, position INTEGER, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)');
  db.run('CREATE TABLE IF NOT EXISTS followed_categories (id INTEGER PRIMARY KEY, user_id INTEGER, category TEXT, twitch_id TEXT, box_art_url TEXT, position INTEGER, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)');

  db.run('CREATE TABLE IF NOT EXISTS clips (id INTEGER PRIMARY KEY, twitchId TEXT UNIQUE, url TEXT, embed_url TEXT, broadcaster_id TEXT, broadcaster_name TEXT, creator_id TEXT, creator_name TEXT, video_id TEXT, game_id TEXT, language TEXT, title TEXT, view_count INTEGER, created_at TEXT, thumbnail_url TEXT, duration INTEGER)');
});

async function generateNewRandomUsername(db) {
  const usernames = await getUsernames(db); //TODO: import getUsernames

  let username;
  do {
    username = `anon_${Math.floor(Math.random() * 1000000)}`;
  } while (usernames.has(username));

  return username;
}

async function getUsernames(db) {
  const usernamesQuery = 'SELECT username FROM users';
  const parameters = [];
  const usernameRows = await runAsyncQuery(db, usernamesQuery, parameters);

  const usernames = new Set(usernameRows.map(row => row.username));
  return usernames;
}

function getAllRowsFromTable(tableName, res) {
  const query = `SELECT * FROM ${tableName}`;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

function getValueFilteredDataFromTable(tableName, columnName, filterValue, res) {
  const query = `SELECT * FROM ${tableName} WHERE ${columnName} = ?`;

  db.all(query, [filterValue], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

function insertRowIntoTable(tableName, columnNames, parameters, res) {
  const query = `INSERT OR IGNORE INTO ${tableName} (${columnNames.join(', ')}) VALUES (${columnNames.map(() => '?').join(', ')})`;

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
          return res.status(404).json({ message: 'No row matched query conditions' });
      }
      
      console.log(`Deleted ${this.changes} row(s) from ${tableName} with params:`, parameters);
      res.status(200).json({ message: `${tableName} row removed`, id: this.lastID });
    });
}

function dbGetAsync(query, params) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function dbRunAsync(query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

async function getSignedOutUserId(clientId) {
  const query = `SELECT id, username FROM users WHERE client_id = ? LIMIT 1`;
  const row = await dbGetAsync(query, [clientId]);

  if (row) {
    return { userId: row.id, username: row.username };
  }

  const username = await generateNewRandomUsername(db);
  const insert = `INSERT INTO users (client_id, username, password) VALUES (?, ?, NULL)`;
  const newUserId = await dbRunAsync(insert, [clientId, username]);

  return { userId: newUserId, username: username} ;
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

app.use("/clips", clipsRouter);
app.use("/users", usersRouter);
// ---------------------------- Users ------------------------------
// Get all users
app.get('/users', (req, res) => {
  getAllRowsFromTable('users', res);
});

app.get('/signed-out-user', async (req, res) => {
  const { clientId } = req.query;

  if (!clientId) {
    return res.status(400).json({ error: 'Missing clientId' });
  }

  try {
    const { userId, username } = await getSignedOutUserId(clientId);
    res.status(200).json({ userId, username });
  } catch (err) {
    console.error('Failed to get signed out user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user username and password
app.patch('/:userId/login', (req, res) => {
  const { userId } = req.params;
  const { username, password } = req.body;

  const updateQuery = `
    UPDATE users
    SET username = ?, password = ?
    WHERE id = ?
  `;
  const parameters = [username, password, userId];

  db.run(updateQuery, parameters, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`User: ${userId} username and password updated successfully. New username: ${username}`);
    res.json({ message: 'Login updated successfully' });
  });
});
// ---------------------------- Clips ------------------------------
app.get('/clips/:userId/votes', (req, res) => {
  const userId = req.params.userId;

  // user votes, favorites, comments
  // join clips table
  // select clip data adding to each row
  const filterValue = userId;

  const query = `
    SELECT
      v.id AS vote_id,
      v.user_id,
      v.clip_id AS vote_clip_id,
      v.vote,

      c.id AS clip_id,
      c.twitchId,
      c.url,
      c.embed_url,
      c.broadcaster_id,
      c.broadcaster_name,
      c.creator_id,
      c.creator_name,
      c.video_id,
      c.game_id,
      c.language,
      c.title,
      c.view_count,
      c.created_at,
      c.thumbnail_url,
      c.duration

    FROM votes v
    JOIN clips c ON c.twitchId = v.clip_id
    WHERE v.user_id = ?
  `;

  db.all(query, [filterValue], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/clips/:userId/favorites', (req, res) => {
  const userId = req.params.userId;

  const filterValue = userId;
  const query = `
    SELECT
      f.id AS favorite_id,
      f.user_id,
      f.clip_id AS favorite_clip_id,

      c.id AS clip_id,
      c.twitchId,
      c.url,
      c.embed_url,
      c.broadcaster_id,
      c.broadcaster_name,
      c.creator_id,
      c.creator_name,
      c.video_id,
      c.game_id,
      c.language,
      c.title,
      c.view_count,
      c.created_at,
      c.thumbnail_url,
      c.duration

    FROM favorites f
    JOIN clips c ON c.twitchId = f.clip_id
    WHERE f.user_id = ?
  `;


  db.all(query, [filterValue], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/clips/:userId/comments', (req, res) => {
  const userId = req.params.userId;

  const filterValue = userId;
  const query = `
    SELECT
      cm.id AS comment_id,
      cm.clip_id AS comment_clip_id,
      cm.user_id,
      cm.parent_id,
      cm.comment,
      cm.timestamp,

      c.id AS clip_id,
      c.twitchId,
      c.url,
      c.embed_url,
      c.broadcaster_id,
      c.broadcaster_name,
      c.creator_id,
      c.creator_name,
      c.video_id,
      c.game_id,
      c.language,
      c.title,
      c.view_count,
      c.created_at,
      c.thumbnail_url,
      c.duration

    FROM comments cm
    JOIN clips c ON c.twitchId = cm.clip_id
    WHERE cm.user_id = ?
  `;

  db.all(query, [filterValue], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/clips/:userId/history', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT
      h.id AS history_id,
      h.user_id,
      h.twitch_id AS history_clip_id,
      h.timestamp,

      c.id AS clip_id,
      c.twitchId,
      c.url,
      c.embed_url,
      c.broadcaster_id,
      c.broadcaster_name,
      c.creator_id,
      c.creator_name,
      c.video_id,
      c.game_id,
      c.language,
      c.title,
      c.view_count,
      c.created_at,
      c.thumbnail_url,
      c.duration

    FROM history h
    JOIN clips c ON c.twitchId = h.twitch_id
    WHERE h.user_id = ?
    ORDER BY h.timestamp DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// ----------------------------History------------------------------
app.post('/history', (req, res) => {
  const { userId, clipTwitchId: twitchId } = req.body;

  // const query = 'INSERT INTO favorites (user_id, clip_id) VALUES (?, ?)';
  const tableName = 'history';
  const columnNames = ['user_id', 'twitch_id'];
  const parameters = [userId, twitchId];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});
// ---------------------------- Comments ------------------------------
// this should get all of a user's activity - upvotes downvotes favorites comments follows
app.get('/:userId/activity', (req, res) => {
  res.send('activity endpoint hit');
});

app.get('/users/:userId/comments', (req, res) => {
  const userId = req.params.userId;
  const tableName = 'comments';
  const columnName = 'user_id';
  const filterValue = userId;
  getValueFilteredDataFromTable(tableName, columnName, filterValue, res);
});

// Get all comments on clip
// TODO: refactor path
app.get('/abc/clips/:clipId/comments', (req, res) => {
  const clipId = req.params.clipId;
  const userId = req.query.userId;

  const query = `
    SELECT 
      comments.*, 
      users.username,
      COUNT(comment_likes.id) AS likes,
      EXISTS (
        SELECT 1 FROM comment_likes cl
        WHERE cl.comment_id = comments.id AND cl.user_id = ?
      ) AS liked
    FROM comments
    LEFT JOIN users ON comments.user_id = users.id
    LEFT JOIN comment_likes ON comment_likes.comment_id = comments.id
    WHERE comments.clip_id = ?
    GROUP BY comments.id
    ORDER BY comments.timestamp DESC
  `;

  db.all(query, [userId, clipId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

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
app.delete('/clips/:clipId/comments/:commentId', (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  const tableName = 'comments';
  const columnNames = ['id', 'user_id'];
  const parameters = [commentId, userId];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});

// Soft delete comment
app.patch('/clips/:clipId/comments/:commentId', (req, res) => {
  const { commentId } = req.params;
  const { userId, comment, timestamp } = req.body;

  const updateQuery = `
    UPDATE comments
    SET user_id = ?, comment = ?, timestamp = ?
    WHERE id = ?
  `;
  const parameters = [userId, comment, timestamp, commentId];

  db.run(updateQuery, parameters, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment updated successfully' });
  });
});

// Post like
app.post('/:userId/clips/:clipId/:commentId/likes', (req, res) => {
  const { userId, commentId } = req.params;

  const tableName = 'comment_likes';
  const columnNames = ['user_id', 'comment_id'];
  const parameters = [userId, commentId];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// Delete like
app.delete('/:userId/clips/:clipId/:commentId/likes', (req, res) => {
  const { userId, commentId } = req.params;

  const tableName = 'comment_likes';
  const columnNames = ['user_id', 'comment_id'];
  const parameters = [userId, commentId];

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

// ---------------------------- Clips ------------------------------

app.post('/clips', (req, res) => {
  const { id: twitchId, url, embed_url, broadcaster_id, broadcaster_name, creator_id, creator_name, video_id, game_id, language, title, view_count, created_at, thumbnail_url, duration } = req.body;

  const tableName = 'clips';
  const columnNames = ['twitchId', 'url', 'embed_url', 'broadcaster_id', 'broadcaster_name', 'creator_id', 'creator_name', 'video_id', 'game_id', 'language', 'title', 'view_count', 'created_at', 'thumbnail_url', 'duration'];
  const parameters = [twitchId, url, embed_url, broadcaster_id, broadcaster_name, creator_id, creator_name, video_id, game_id, language, title, view_count, created_at, thumbnail_url, duration];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// ---------------------------- Votes ------------------------------
// Get all user votes
app.get('/votes/:userId', (req, res) => {
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
// TODO: change abc to meaningful name, avoid conflicting with '/clips/:userId/votes'
app.get('/abc/:clipId/votes', (req, res) => {
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

  const streamersQuery = `SELECT streamer, twitch_id, profile_picture_url, position FROM followed_streamers WHERE user_id = ?`;
  const categoriesQuery = `SELECT category, twitch_id, box_art_url, position FROM followed_categories WHERE user_id = ?`;

  db.all(streamersQuery, [userId], (err, streamerRows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    db.all(categoriesQuery, [userId], (err, categoryRows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const formattedCategoryRows = categoryRows.map(row => ({
        category: row.category,
        categoryId: row.twitch_id,
        boxArtUrl: row.box_art_url,
        position: row.position
      }));

      // Sort rows in ascending order with respect to position
      res.json({ streamers: streamerRows.sort((a, b) => a.position - b.position), categories: formattedCategoryRows.sort((a, b) => a.position - b.position)});
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
  const { twitchId, profilePictureUrl } = req.body;

  const tableName = 'followed_streamers';

  // Insert streamer data, auto-incrementing position so position defaults to row number
  const query = `
    INSERT OR IGNORE INTO ${tableName} 
    (user_id, streamer, twitch_id, profile_picture_url, position)
    VALUES (
      ?, ?, ?, ?,
      COALESCE(
        (SELECT MAX(position) + 1 FROM ${tableName} WHERE user_id = ?),
        1
      )
    )
  `;

  const parameters = [userId, streamer, twitchId, profilePictureUrl, userId];

  db.run(query, parameters, function (err) {
    if (err) {
      console.error(`Error inserting into ${tableName}:`, err);
      return res.status(500).json({ error: err.message });
    }

    console.log(`Inserted row into ${tableName} with ID:`, this.lastID);
    res.status(201).json({ 
      message: `Row added to ${tableName}`, 
      id: this.lastID 
    });
  });
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
  const { userId, category } = req.params;
  const { twitchId, boxArtUrl } = req.body;

  const tableName = 'followed_categories';

  // Auto-increment position so it matches row number
  const query = `
    INSERT OR IGNORE INTO ${tableName} 
    (user_id, category, twitch_id, box_art_url, position)
    VALUES (
      ?, ?, ?, ?,
      COALESCE(
        (SELECT MAX(position) + 1 FROM ${tableName} WHERE user_id = ?),
        1
      )
    )
  `;

  const parameters = [userId, category, twitchId, boxArtUrl, userId];

  db.run(query, parameters, function (err) {
    if (err) {
      console.error(`Error inserting into ${tableName}:`, err);
      return res.status(500).json({ error: err.message });
    }

    console.log(`Inserted row into ${tableName} with ID:`, this.lastID);
    res.status(201).json({
      message: `Row added to ${tableName}`,
      id: this.lastID
    });
  });
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

// Swap positions
app.patch('/users/:userId/following/:followType', async (req, res) => {
  const { userId, followType } = req.params;
  const { firstStreamerOrCategoryName, secondStreamerOrCategoryName } = req.body;

  const tableName = followType === 'streamers' ? 'followed_streamers' : 'followed_categories';

  try {
    await swapPositions(tableName, userId, firstStreamerOrCategoryName, secondStreamerOrCategoryName);
    res.send({ message: 'Positions swapped successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Failed to swap positions', error: err.message });
  }
});

async function swapPositions(tableName, userId, streamerA, streamerB) {
  try {
    await dbRunAsync('BEGIN TRANSACTION');

    const rowA = await new Promise((resolve, reject) => {
      db.get(
        `SELECT position FROM ${tableName} WHERE user_id = ? AND streamer = ?`,
        [userId, streamerA],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    const rowB = await new Promise((resolve, reject) => {
      db.get(
        `SELECT position FROM ${tableName} WHERE user_id = ? AND streamer = ?`,
        [userId, streamerB],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    if (!rowA || !rowB) throw new Error('One of the streamers not found');

    await dbRunAsync(
      `UPDATE ${tableName} SET position = ? WHERE user_id = ? AND streamer = ?`,
      [rowB.position, userId, streamerA]
    );

    await dbRunAsync(
      `UPDATE ${tableName} SET position = ? WHERE user_id = ? AND streamer = ?`,
      [rowA.position, userId, streamerB]
    );

    await dbRunAsync('COMMIT');
    console.log('Swapped successfully!');
  } catch (err) {
    await dbRunAsync('ROLLBACK');
    throw err;
  }
}
// -------------------------------------------------------------------
app.get('/reddit-posts', async (req, res) => {
  try {
    const posts = await getRedditPosts("LivestreamFail", 24);
    res.json(posts);
  } catch (err) {
    console.error("Error in /api/reddit-posts:", err); // ← this will now catch missing import
    res.status(500).json({ error: "Internal server error" });
  }
});
// -------------------------------------------------------------------


// Start server
app.listen(port, () => {
  console.log(`Server running on http://192.168.86.195:${port}`);
});