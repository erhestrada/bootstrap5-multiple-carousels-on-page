import { Router } from 'express';
const favoritesRouter = Router();

// Mounted on /favorites
// Using clips/userId/favorites on the frontend -- i believe this one is obselete
/*
favoritesRouter.get('/:userId/favorites', (req, res) => {
  const userId = req.params.userId;
  const tableName = 'favorites';
  const columnName = 'user_id';
  const filterValue = userId;
  getValueFilteredDataFromTable(tableName, columnName, filterValue, res);
});
*/

// Get favorite status of clip
favoritesRouter.get('/:userId/:clipId', (req, res) => {
  const { userId, clipId } = req.params;

  const query = `SELECT * FROM favorites WHERE user_id = ? AND clip_id = ?`;

  db.get(query, [userId, clipId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.json({ favorited: false });
    }

    res.json({ favorited: true });
  });
});

favoritesRouter.post('/', (req, res) => {
  const { userId, clipId } = req.body;

  // const query = 'INSERT INTO favorites (user_id, clip_id) VALUES (?, ?)';
  const tableName = 'favorites';
  const columnNames = ['user_id', 'clip_id'];
  const parameters = [userId, clipId];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

favoritesRouter.delete('/', (req, res) => {
  const { userId, clipId } = req.body;

  //const query = 'DELETE FROM favorites WHERE user_id = ? AND clip_id = ?';
  const tableName = 'favorites';
  const columnNames = ['user_id', 'clip_id'];
  const parameters = [userId, clipId];

  deleteRowFromTable(tableName, columnNames, parameters, res);
});


export default favoritesRouter;
