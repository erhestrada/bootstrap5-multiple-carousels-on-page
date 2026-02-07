import { Router } from 'express';
const commentsRouter = Router();

// Root is /comments

// this should get all of a user's activity - upvotes downvotes favorites comments follows
commentsRouter.get('/:userId/activity', (req, res) => {
  res.send('activity endpoint hit');
});

commentsRouter.get('/users/:userId/comments', (req, res) => {
  const userId = req.params.userId;
  const tableName = 'comments';
  const columnName = 'user_id';
  const filterValue = userId;
  getValueFilteredDataFromTable(tableName, columnName, filterValue, res);
});

// TODO: make single source of truth endpoints.js to avoid hunting down files with endpoints that need refactoring in the future
// TODO: from here down change frontend routes to start with /comments

// Get all comments on clip
// TODO: refactor path
commentsRouter.get('/abc/clips/:clipId/comments', (req, res) => {
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
commentsRouter.post('/clips/:clipId/comments', (req, res) => {
  const { clipId } = req.params;
  const { userId, parentId, comment } = req.body;

  const tableName = 'comments';
  const columnNames = ['clip_id', 'user_id', 'parent_id', 'comment'];
  const parameters = [clipId, userId, parentId, comment];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// Delete comment
commentsRouter.delete('/clips/:clipId/comments/:commentId', (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  const tableName = 'comments';
  const columnNames = ['id', 'user_id'];
  const parameters = [commentId, userId];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});

// Soft delete comment
commentsRouter.patch('/clips/:clipId/comments/:commentId', (req, res) => {
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

export default commentsRouter;

