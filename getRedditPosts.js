export async function getRedditPosts(subreddit, sortingOption) {
  try {
      const url = `https://www.reddit.com/r/${subreddit}/${sortingOption}.json`;
      console.log(url);
      const options = {
        method: 'GET'
    };
      const response = await fetch(url, options);
      console.log(response);
  } catch (error) {
      console.error(error);
  }
  console.log('hello');
}

getRedditPosts('livestreamfail', 'new');