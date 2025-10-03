export function checkRedditPosts(embedUrl, redditPosts) {
    const clipUrl = new URL(embedUrl);
    const clipId = clipUrl.searchParams.get("clip");

    const matchedPost = redditPosts.find(post => extractClipId(post.linkUrl) === clipId);
    return matchedPost;
}

function extractClipId(url) {
  try {
    const parsedUrl = new URL(url);
    const urlParts = parsedUrl.pathname.split('/');
    const clipIndex = urlParts.indexOf('clip');
    if (clipIndex !== -1 && urlParts.length > clipIndex + 1) {
        const clipId = urlParts[clipIndex + 1];
        return clipId;
    }
  } catch {
    return null;
  }
  return null;
}
