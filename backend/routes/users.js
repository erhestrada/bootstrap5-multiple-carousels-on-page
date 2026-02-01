import { Router } from 'express';
import { getSignedOutUserId, getAllRowsFromTable } from '../utils/utils.js'
const usersRouter = Router();

usersRouter.get('/', (req, res) => {
  getAllRowsFromTable('users', res);
});

usersRouter.get('/signed-out-user', async (req, res) => {
  const { clientId } = req.query;

  if (!clientId) {
    return res.status(400).json({ error: 'Missing clientId' });
  }

  try {
    const { userId, username } = await getSignedOutUserId(clientId);
    res.status(200).json({ userId, username });
  } catch (err) {
    console.error('Failed to get signed out user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user username and password
usersRouter.patch('/:userId/login', (req, res) => {
  const { userId } = req.params;
  const { username, password } = req.body;

  const updateQuery = `
    UPDATE users
    SET username = ?, password = ?
    WHERE id = ?
  `;
  const parameters = [username, password, userId];

  db.run(updateQuery, parameters, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`User: ${userId} username and password updated successfully. New username: ${username}`);
    res.json({ message: 'Login updated successfully' });
  });
});

export default usersRouter;
