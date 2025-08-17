// refactor to use database
export async function getGameFromId(gameId, clientId, authToken) {
  const gameCacheRaw = localStorage.getItem('gameCacheById');
  const gameCache = gameCacheRaw ? JSON.parse(gameCacheRaw) : {};

  let game;
  if (gameCache.hasOwnProperty(gameId)) {
    game = gameCache[gameId];
  } else {
    game = await fetchGameFromId(gameId, clientId, authToken);
    gameCache[gameId] = game;
    localStorage.setItem('gameCacheById', JSON.stringify(gameCache));
  }

  return game;
}

export async function fetchGameFromId(gameId, clientId, authToken) {
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

