import { Router } from 'express';
import { getRedditPosts } from './getRedditPosts.js';
const redditRouter = Router();

redditRouter.get('/posts', async (req, res) => {
  try {
    const posts = await getRedditPosts("LivestreamFail", 24);
    res.json(posts);
  } catch (err) {
    console.error("Error in /api/reddit-posts:", err); // ← this will now catch missing import
    res.status(500).json({ error: "Internal server error" });
  }
});
export default redditRouter;

