import { getClips } from "./getClips";

async function displayForYouCarousels() {
    const followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};
    console.log(followedStreamers);

    const streamerEntries = Object.entries(followedStreamers);

    for (const [streamer, streamerId] of streamerEntries) {
     const clipsForStreamer = await getClips(clientId, authToken, streamerId, 1);   
     console.log(clipsForStreamer);
    }
    
}

displayForYouCarousels();