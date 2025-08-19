async function getPostsFromLast24h(subreddit) {
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - 24 * 60 * 60;

  let after = null;
  let allPosts = [];

  while (true) {
    const url = new URL(`https://www.reddit.com/r/${subreddit}/new.json`);
    url.searchParams.set("limit", "100");
    if (after) url.searchParams.set("after", after);

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const posts = data.data.children.map(c => c.data);

    // filter down to 24h window
    const fresh = posts.filter(p => p.created_utc >= oneDayAgo);
    allPosts.push(...fresh);

    // stop if we've reached posts older than 24h or no more pages
    if (posts.length === 0 || posts[posts.length - 1].created_utc < oneDayAgo) {
      break;
    }

    after = data.data.after;
    if (!after) break;
  }

  return allPosts;
}

// Example usage
(async () => {
  const posts = await getPostsFromLast24h("LivestreamFail");
  console.log(`Found ${posts.length} posts in the last 24h`);
  console.log(posts.map(p => ({
    title: p.title,
    url: `https://reddit.com${p.permalink}`,
    created: new Date(p.created_utc * 1000)
  })));
})();
