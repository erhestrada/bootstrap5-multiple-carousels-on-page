import { runAsyncQuery } from "./runAsyncQuery.js";

export async function getSignedOutUserId(clientId) {
  const query = `SELECT id, username FROM users WHERE client_id = ? LIMIT 1`;
  const row = await dbGetAsync(query, [clientId]);

  if (row) {
    return { userId: row.id, username: row.username };
  }

  const username = await generateNewRandomUsername();
  const insert = `INSERT INTO users (client_id, username, password) VALUES (?, ?, NULL)`;
  const newUserId = await dbRunAsync(insert, [clientId, username]);

  return { userId: newUserId, username: username} ;
}

export async function generateNewRandomUsername(db) {
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

export function dbGetAsync(db, query, params) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

export function dbRunAsync(db, query, params) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}