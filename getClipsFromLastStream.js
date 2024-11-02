export async function getClips(clientId, authToken, streamerId = false, gameId = false, daysBack = 1) {
    try {
        const response = await fetch(makeGetUrl(streamerId, gameId, daysBack), {
        method: 'GET',
        headers: {
            'Client-Id': clientId,
            'Authorization': 'Bearer ' + authToken
        }
        });
        const clipsData = await response.json();
        const embedUrls = clipsData.data.map((datum) => datum.embed_url);
        const streamerIds = clipsData.data.map((datum) => datum.broadcaster_id);

        return clipsData;
    } catch (error) {
        console.error(error);
    }
}


// The id, game_id, and broadcaster_id query parameters are mutually exclusive.
function makeGetUrl(streamerId, gameId, daysBack) {
    const currentDateTime = getCurrentDateTime();
    const pastDateTime = getPastDateTime(daysBack);
    
    if (streamerId) {
        return "https://api.twitch.tv/helix/clips?broadcaster_id=" + streamerId + "&started_at=" + pastDateTime + "&ended_at=" + currentDateTime + "&is_featured=false" + "&first=100";  
    } else if (gameId) {
        return "https://api.twitch.tv/helix/clips?game_id=" + gameId + "&started_at=" + pastDateTime + "&ended_at=" + currentDateTime + "&is_featured=false" + "&first=100";  
    }

  }

  function getIdForStreamer(streamer) {

  }