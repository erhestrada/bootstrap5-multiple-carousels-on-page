export async function getClipsForStreamer(clientId, authToken, streamer, daysBack = 1) {
    const streamerId = getIdForStreamer(streamer);
    //const clipsData = await getClips(clientId, authToken, streamerId, false, daysBack);
    //return clipsData
    return streamerId
}

async function getIdForStreamer(streamer) {
    // curl -X GET 'https://api.twitch.tv/helix/users?login=twitchdev' -H 'Authorization: Bearer ymcfbojkyx4vhe64v0n3sh3jlqbtcj' -H 'Client-Id: dvboj01l2rgahrw7qdafpjags6v98m'
    try {
        const streamerUrl = "https://api.twitch.tv/helix/users?login=" + streamer;
        const response = await fetch(streamerUrl, {
        method: 'GET',
        headers: {
            'Client-Id': clientId,
            'Authorization': 'Bearer ' + authToken
        }
        });

        const streamerData = await response.json();
        console.log(streamerData);
        return streamerData

    } catch (error) {
        console.error(error);
    }
}


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
        console.log(embedUrls);

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

function getCurrentDateTime() {
    const dateTime = new Date();
    const rfcDateTime = dateTime.toISOString();
    return rfcDateTime;
}
    
function getPastDateTime(daysBack) {
    const hoursBack = daysBack * 24;
    const dateTime = new Date();
    const pastDateTime = new Date(dateTime.getTime() - hoursBack * 60 * 60 * 1000);
    const pastRfcDateTime = pastDateTime.toISOString();
    return pastRfcDateTime;
}
