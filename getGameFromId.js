// let me do local storage for now to avoid the request
// turn off carousel arrows for streamer bar carousel

export async function getGameFromId(gameId, clientId, authToken) {
  try {
    const response = await fetch(`https://api.twitch.tv/helix/games?id=${gameId}`, {
      method: 'GET',
      headers: {
        'Client-Id': clientId,
        'Authorization': 'Bearer ' + authToken
      }
    });

    const clipData = await response.json();

    if (clipData.data && clipData.data.length > 0) {
      const game = clipData.data[0].name;
      return game;
    } else {
      return '';
    }

  } catch (error) {
    console.error('Failed to fetch game info:', error);
    return '';
  }
}

