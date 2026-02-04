import { Router } from 'express';
import { insertRowIntoTable } from '../utils/utils.js';

const historyRouter = Router();

historyRouter.post('/', (req, res) => {
  const { userId, clipTwitchId: twitchId } = req.body;

  // const query = 'INSERT INTO favorites (user_id, clip_id) VALUES (?, ?)';
  const tableName = 'history';
  const columnNames = ['user_id', 'twitch_id'];
  const parameters = [userId, twitchId];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});

export default historyRouter;
