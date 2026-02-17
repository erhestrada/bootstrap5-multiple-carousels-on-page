import { Router } from 'express';
const clipsRouter = Router();

// root is /clips
clipsRouter.post('/', (req, res) => {
  const { id: twitchId, url, embed_url, broadcaster_id, broadcaster_name, creator_id, creator_name, video_id, game_id, language, title, view_count, created_at, thumbnail_url, duration } = req.body;

  const tableName = 'clips';
  const columnNames = ['twitchId', 'url', 'embed_url', 'broadcaster_id', 'broadcaster_name', 'creator_id', 'creator_name', 'video_id', 'game_id', 'language', 'title', 'view_count', 'created_at', 'thumbnail_url', 'duration'];
  const parameters = [twitchId, url, embed_url, broadcaster_id, broadcaster_name, creator_id, creator_name, video_id, game_id, language, title, view_count, created_at, thumbnail_url, duration];

  insertRowIntoTable(tableName, columnNames, parameters, res);
});


// TODO: implement all the twitch api function calls here
clipsRouter.get('/top', (req, res) => {
    res.send({message: "Top clips endpoint hit"});
});


clipsRouter.get('/:userId/votes', (req, res) => {
  const userId = req.params.userId;

  // user votes, favorites, comments
  // join clips table
  // select clip data adding to each row
  const filterValue = userId;

  const query = `
    SELECT
      v.id AS vote_id,
      v.user_id,
      v.clip_id AS vote_clip_id,
      v.vote,

      c.id AS clip_id,
      c.twitchId,
      c.url,
      c.embed_url,
      c.broadcaster_id,
      c.broadcaster_name,
      c.creator_id,
      c.creator_name,
      c.video_id,
      c.game_id,
      c.language,
      c.title,
      c.view_count,
      c.created_at,
      c.thumbnail_url,
      c.duration

    FROM votes v
    JOIN clips c ON c.twitchId = v.clip_id
    WHERE v.user_id = ?
  `;

  db.all(query, [filterValue], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

clipsRouter.get('/:userId/favorites', (req, res) => {
  const userId = req.params.userId;

  const filterValue = userId;
  const query = `
    SELECT
      f.id AS favorite_id,
      f.user_id,
      f.clip_id AS favorite_clip_id,

      c.id AS clip_id,
      c.twitchId,
      c.url,
      c.embed_url,
      c.broadcaster_id,
      c.broadcaster_name,
      c.creator_id,
      c.creator_name,
      c.video_id,
      c.game_id,
      c.language,
      c.title,
      c.view_count,
      c.created_at,
      c.thumbnail_url,
      c.duration

    FROM favorites f
    JOIN clips c ON c.twitchId = f.clip_id
    WHERE f.user_id = ?
  `;


  db.all(query, [filterValue], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

clipsRouter.get('/:userId/comments', (req, res) => {
  const userId = req.params.userId;

  const filterValue = userId;
  const query = `
    SELECT
      cm.id AS comment_id,
      cm.clip_id AS comment_clip_id,
      cm.user_id,
      cm.parent_id,
      cm.comment,
      cm.timestamp,

      c.id AS clip_id,
      c.twitchId,
      c.url,
      c.embed_url,
      c.broadcaster_id,
      c.broadcaster_name,
      c.creator_id,
      c.creator_name,
      c.video_id,
      c.game_id,
      c.language,
      c.title,
      c.view_count,
      c.created_at,
      c.thumbnail_url,
      c.duration

    FROM comments cm
    JOIN clips c ON c.twitchId = cm.clip_id
    WHERE cm.user_id = ?
  `;

  db.all(query, [filterValue], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

clipsRouter.get('/:userId/history', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT
      h.id AS history_id,
      h.user_id,
      h.twitch_id AS history_clip_id,
      h.timestamp,

      c.id AS clip_id,
      c.twitchId,
      c.url,
      c.embed_url,
      c.broadcaster_id,
      c.broadcaster_name,
      c.creator_id,
      c.creator_name,
      c.video_id,
      c.game_id,
      c.language,
      c.title,
      c.view_count,
      c.created_at,
      c.thumbnail_url,
      c.duration

    FROM history h
    JOIN clips c ON c.twitchId = h.twitch_id
    WHERE h.user_id = ?
    ORDER BY h.timestamp DESC
  `;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

export default clipsRouter;
