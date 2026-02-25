import { Router } from 'express';
const votesRouter = Router();

// ---------------------------- Votes ------------------------------
// Get all user votes
votesRouter.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  const tableName = 'votes';
  const columnName = 'user_id';
  const filterValue = userId;
  getValueFilteredDataFromTable(tableName, columnName, filterValue, res);
});

votesRouter.get('/:userId/:clipId', (req, res) => {
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

// getNetVotes() on frontend
// Get upvotes, downvotes, and net votes on a clip
// TODO: change abc to meaningful name, avoid conflicting with '/clips/:userId/votes'
votesRouter.get('/abc/:clipId/votes', (req, res) => {
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
votesRouter.post('/', async (req, res) => {
  const { userId, clipId, vote } = req.body;
  // const query = 'INSERT INTO comments (user_id, clip_id, comment) VALUES (?, ?, ?)';
  const tableName = 'votes';
  const columnNames = ['user_id', 'clip_id', 'vote'];
  const parameters = [userId, clipId, vote];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// Edit vote
votesRouter.put('/:voteId', (req, res) => {
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
votesRouter.delete('/', (req, res) => {
  const { userId, clipId } = req.body;

  //const query = 'DELETE FROM favorites WHERE user_id = ? AND clip_id = ?';
  const tableName = 'votes';
  const columnNames = ['user_id', 'clip_id'];
  const parameters = [userId, clipId];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});

// -------------------------------------------------------------------

export default votesRouter;

