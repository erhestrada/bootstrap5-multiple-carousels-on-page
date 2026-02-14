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
app.use("/favorites", favoritesRouter);
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

// -------------------------------------------------------------------


// Start server
app.listen(port, () => {
  console.log(`Server running on http://192.168.86.195:${port}`);
});
