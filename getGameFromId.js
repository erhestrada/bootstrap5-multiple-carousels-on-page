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

    if (data.data && data.data.length > 0) {
      return data.data[0]; // The game object (e.g., name, id, box_art_url)
    } else {
      return null; // No game found
    }

  } catch (error) {
    console.error('Failed to fetch game info:', error);
    return null;
  }
}
