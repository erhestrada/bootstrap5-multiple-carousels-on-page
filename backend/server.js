import express from 'express';
import cors from 'cors';
import sqlite3Pkg from 'sqlite3';
import os from "os";
import { getRedditPosts } from './getRedditPosts.js';
//import { getTwitchAcessToken } from './getTwitchAccessToken.js';
import { clipsRouter, votesRouter, favoritesRouter, usersRouter, historyRouter, commentsRouter, likesRouter, followsRouter } from './routes/index.js';
import { generateNewRandomUsername, dbGetAsync, dbRunAsync, getAllRowsFromTable, getValueFilteredDataFromTable, getSignedOutUserId } from './utils/utils.js';
import { initializeDb } from './utils/utils.js';

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

// Middleware to make db accessible to routers (TODO: refactor into service layer)
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use("/clips", clipsRouter);
app.use("/comments", commentsRouter);
app.use("/favorites", favoritesRouter);
app.use("/follows", followsRouter);
app.use("/history", historyRouter);
app.use("/likes", likesRouter);
app.use("/users", usersRouter); // TODO: test patch user/login
app.use("/votes", votesRouter);

function getLanIp() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (
        net.family === "IPv4" &&
        !net.internal &&
        (net.address.startsWith("192.168.") ||
         net.address.startsWith("10.") ||
         net.address.startsWith("172."))
      ) {
        return net.address;
      }
    }
  }

  return null;
}

// Start server
app.listen(port, () => {
  const lanIp = getLanIp();

  console.log(`Server running at:`);
  console.log(`  Local:   http://localhost:${port}`);
  if (lanIp) {
    console.log(`  Network: http://${lanIp}:${port}`);
  } else {
    console.log(`  Network: not detected`);
  }
});
