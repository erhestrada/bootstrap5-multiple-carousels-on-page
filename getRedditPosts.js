async function getRedditPosts(subreddit, hoursBack) {
  const now = Math.floor(Date.now() / 1000);
  const oneDayAgo = now - hoursBack * 60 * 60;

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

  const formattedPosts = allPosts.map(p => ({
    title: p.title,
    redditUrl: `https://reddit.com${p.permalink}`, // always Reddit comments page
    linkUrl: p.url,                               // external link if it’s a link post
    created: new Date(p.created_utc * 1000)
  }));

  return formattedPosts;
}


(async () => {
  const posts = await getRedditPosts("LivestreamFail", 24);
  console.log(`Found ${posts.length} posts in the last 24h`);
  console.log(posts);
})();
