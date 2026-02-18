import express from 'express';
import cors from 'cors';
import sqlite3Pkg from 'sqlite3';
import { getRedditPosts } from './getRedditPosts.js';
//import { getTwitchAcessToken } from './getTwitchAccessToken.js';
import { clipsRouter, votesRouter, favoritesRouter, usersRouter, historyRouter, commentsRouter, likesRouter } from './routes/index.js';
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
app.use("/likes", likesRouter);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://192.168.86.195:${port}`);
});
