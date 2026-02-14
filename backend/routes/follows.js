// TODO: set up follows router
// ---------------------------- Follows ------------------------------
// Get all user follows - followed streamers and followed categories
followsRouter.get('/users/:id/following', (req, res) => {
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
followsRouter.get('/users/:id/following/:kind', (req, res) => {
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
followsRouter.post('/users/:userId/following/streamers/:streamer', (req, res) => {
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
followsRouter.delete('/users/:userId/following/streamers/:streamer', (req, res) => {
  const { userId, streamer } = req.params;
  const { twitchId } = req.body

  const tableName = 'followed_streamers';
  const columnNames = ['user_id', 'streamer', 'twitch_id'];
  const parameters = [userId, streamer, twitchId];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});

// Post category to follow
followsRouter.post('/users/:userId/following/categories/:category', (req, res) => {
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
followsRouter.delete('/users/:userId/following/categories/:category', (req, res) => {
  const { userId, category } = req.params
  const { twitchId, boxArtUrl } = req.body;

  const tableName = 'followed_categories';
  const columnNames = ['user_id', 'category', 'twitch_id', 'box_art_url'];
  const parameters = [userId, category, twitchId, boxArtUrl];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});

// Swap positions
followsRouter.patch('/users/:userId/following/:followType', async (req, res) => {
  const { userId, followType } = req.params;
  const { firstStreamerOrCategoryName, secondStreamerOrCategoryName } = req.body;

  const tableName = followType === 'streamers' ? 'followed_streamers' : 'followed_categories';

  try {
    await swapPositions(tableName, userId, firstStreamerOrCategoryName, secondStreamerOrCategoryName);
    res.send({ message: 'Positions swfollowsRouter.d successfully' });
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
    console.log('SwfollowsRouter.d successfully!');
  } catch (err) {
    await dbRunAsync(db, 'ROLLBACK');
    throw err;
  }
}
// -------------------------------------------------------------------
followsRouter.get('/reddit-posts', async (req, res) => {
  try {
    const posts = await getRedditPosts("LivestreamFail", 24);
    res.json(posts);
  } catch (err) {
    console.error("Error in /api/reddit-posts:", err); // ← this will now catch missing import
    res.status(500).json({ error: "Internal server error" });
  }
});
