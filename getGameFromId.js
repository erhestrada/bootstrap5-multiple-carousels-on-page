export async function getGameFromId(gameId, clientId, authToken) {
  try {
    const response = await fetch(`https://api.twitch.tv/helix/games?id=${gameId}`, {
      method: 'GET',
      headers: {
        'Client-Id': clientId,
        'Authorization': 'Bearer ' + authToken
      }
    });

    const data = await response.json();
    const x = data.data[0].name;
    console.log('game data: ', data);

    if (data.data && data.data.length > 0) {
      return x;
    } else {
      return null; // No game found
    }

  } catch (error) {
    console.error('Failed to fetch game info:', error);
    return null;
  }
}

