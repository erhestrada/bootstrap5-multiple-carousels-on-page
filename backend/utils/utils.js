export async function getSignedOutUserId(clientId) {
  const query = `SELECT id, username FROM users WHERE client_id = ? LIMIT 1`;
  const row = await dbGetAsync(db, query, [clientId]);

  if (row) {
    return { userId: row.id, username: row.username };
  }

  const username = await generateNewRandomUsername(db);
  const insert = `INSERT INTO users (client_id, username, password) VALUES (?, ?, NULL)`;
  const newUserId = await dbRunAsync(db, insert, [clientId, username]);

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

export function getAllRowsFromTable(tableName, res) {
  const query = `SELECT * FROM ${tableName}`;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

function runAsyncQuery(db, query, parameters) {
  return new Promise((resolve, reject) => {
    db.all(query, parameters, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

export function getValueFilteredDataFromTable(tableName, columnName, filterValue, res) {
  const query = `SELECT * FROM ${tableName} WHERE ${columnName} = ?`;

  db.all(query, [filterValue], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
}

export function insertRowIntoTable(tableName, columnNames, parameters, res) {
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

export function deleteRowFromTable(tableName, columnNames, parameters, res) {
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

export function nestComments(flatComments) {
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
