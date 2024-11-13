export async function getRedditPosts(subreddit, sortingOption) {
    try {
        const url = '';
        const options = '';
        const response = await fetch(url, options);
    } catch (error) {
        console.error(error);
    }
    console.log('hello');
}

getRedditPosts('livestreamfail');


export async function getTopClips(clientId, authToken, carouselName, game, daysBack, broadcasterName = false, gameId = false) {
    try {
      const response = await fetch(makeGetUrl(game, daysBack, broadcasterName, gameId), {
        method: 'GET',
        headers: {
          'Client-Id': clientId,
          'Authorization': 'Bearer ' + authToken
        }
      });
      const clipsData = await response.json();
      const embedUrls = clipsData.data.map((datum) => datum.embed_url);
      const streamerIds = clipsData.data.map((datum) => datum.broadcaster_id);
      const streamers = clipsData.data.map((datum) => datum.broadcaster_name);
      window.clipsData[carouselName] = clipsData;

      // this happens one time, not every time
      if (game === "Just Chatting") {
        window.currentClipPosition = {'game': carouselName, 'index': 0};
        saveClipPositionData(0, embedUrls, streamerIds);
        replaceCarouselItem(0, embedUrls, streamerIds, streamers);
        updateDonutPfp(streamerIds[0]);
        updateStreamerBarCarousel(streamerIds[0]);
      }
      
      makeClipsCarouselFromClipsData(clipsData, carouselName +"-carousel-inner", carouselName);
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }