import express from 'express';
import cors from 'cors';
import sqlite3Pkg from 'sqlite3';
import { getRedditPosts } from './getRedditPosts.js';
//import { getTwitchAcessToken } from './getTwitchAccessToken.js';
import { clipsRouter, votesRouter, favoritesRouter, usersRouter, historyRouter, commentsRouter } from './routes/index.js';
import { generateNewRandomUsername, dbGetAsync, dbRunAsync, getAllRowsFromTable, getValueFilteredDataFromTable, getSignedOutUserId } from './utils/utils.js';
import { insertRowIntoTable, deleteRowFromTable, nestComments, initializeDb } from './utils/utils.js';

// TODO: connect twitch authtoken from token.json to auth token in ../config.js - the one i'm actually using
// TODO: run getTwitchAccessToken separately from when server starts
// TODO: refactor frontend code that uses clientId, authToken, clientSecret to go through requests to backend
// TODO: instead of calling getTwitchAccessToken once when the server starts, call twitchGet with getTwitchAccessToken() as first line so
    // i'm checking if the twitchAccessToken is up to date every time i make a twitch get request
//getTwitchAcessToken();

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

initializeDb(db);

app.use("/clips", clipsRouter);
app.use("/users", usersRouter); // TODO: test patch user/login
app.use("/history", historyRouter);
app.use("/comments", commentsRouter);
// ---------------------------- Likes ------------------------------

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
    await dbRunAsync(db, 'BEGIN TRANSACTION');

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

    await dbRunAsync(db,
      `UPDATE ${tableName} SET position = ? WHERE user_id = ? AND streamer = ?`,
      [rowB.position, userId, streamerA]
    );

    await dbRunAsync(db,
      `UPDATE ${tableName} SET position = ? WHERE user_id = ? AND streamer = ?`,
      [rowA.position, userId, streamerB]
    );

    await dbRunAsync(db, 'COMMIT');
    console.log('Swapped successfully!');
  } catch (err) {
    await dbRunAsync(db, 'ROLLBACK');
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
