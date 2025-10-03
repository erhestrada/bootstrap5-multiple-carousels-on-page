export async function getRedditPosts() {
  try {
    const res = await fetch('http://192.168.86.195:3000/reddit-posts');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const redditPosts = await res.json();
    return redditPosts;
  } catch (err) {
    console.error("Failed to fetch Reddit posts:", err);
    return [];
  }
}
