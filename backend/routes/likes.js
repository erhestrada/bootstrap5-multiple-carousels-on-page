import { Router } from 'express';
const likesRouter = Router();

// Post like
likesRouter.post('/:userId/clips/:clipId/:commentId/likes', (req, res) => {
  const { userId, commentId } = req.params;

  const tableName = 'comment_likes';
  const columnNames = ['user_id', 'comment_id'];
  const parameters = [userId, commentId];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

// Delete like
likesRouter.delete('/:userId/clips/:clipId/:commentId/likes', (req, res) => {
  const { userId, commentId } = req.params;

  const tableName = 'comment_likes';
  const columnNames = ['user_id', 'comment_id'];
  const parameters = [userId, commentId];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});

export default likesRouter;

