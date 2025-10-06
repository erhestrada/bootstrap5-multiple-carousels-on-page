export function checkRedditPosts(embedUrl, redditPosts) {
    const clipUrl = new URL(embedUrl);
    const clipId = clipUrl.searchParams.get("clip");

    // https://www.twitch.tv/robcdee/clip/IncredulousSmokyLaptopDBstyle-bLEuqGl1hFGyyfgt
    // https://clips.twitch.tv/FrigidPoliteKathyShadyLulu-jizZPTJxGwgYMGH2
    const matchedPost = redditPosts.find(post => extractClipId(post.linkUrl) === clipId);
    return matchedPost;
}

function extractClipId(url) {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean); // Filter out empty strings e.g. ["", "..."] from "/..."

    // Format 1: twitch.tv/channel/clip/SmokyLaptop
    const clipIndex = pathParts.indexOf('clip');
    if (clipIndex !== -1 && pathParts.length > clipIndex + 1) {
      return pathParts[clipIndex + 1];
    }

    // Format 2: clips.twitch.tv/SmokyLaptop
    if (parsedUrl.hostname === 'clips.twitch.tv' && pathParts.length >= 1) {
      return pathParts[0];
    }

  } catch {
    return null;
  }

  return null;
}
