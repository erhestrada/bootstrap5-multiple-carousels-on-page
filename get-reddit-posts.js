let cachedRedditPosts = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // cache for 5 minutes

export async function getRedditPosts() {
  const now = Date.now();
  if (cachedRedditPosts && (now - cacheTimestamp) < CACHE_TTL) {
    console.log('Using cached Reddit posts');
    return cachedRedditPosts;
  }

  try {
    const res = await fetch('http://192.168.86.195:3000/reddit-posts');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const redditPosts = await res.json();

    cachedRedditPosts = redditPosts;
    cacheTimestamp = now;

    return redditPosts;
  } catch (err) {
    console.error("Failed to fetch Reddit posts:", err);
    return [];
  }
}
