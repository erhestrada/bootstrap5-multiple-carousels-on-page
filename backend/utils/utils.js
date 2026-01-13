async function getSignedOutUserId(clientId) {
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

async function generateNewRandomUsername() {
  const usernames = await getUsernames();

  let username;
  do {
    username = `anon_${Math.floor(Math.random() * 1000000)}`;
  } while (usernames.has(username));

  return username;
}

function dbGetAsync(query, params) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}
