import { getClips } from "./getClips";
import { displayClipsData } from "./displayClipsData";

async function displayForYouCarousels() {
    const followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};
    console.log(followedStreamers);

    const streamerEntries = Object.entries(followedStreamers);

    const containerId = 'container';
    
    for (const [streamer, streamerId] of streamerEntries) {
     const clipsDataForStreamer = await getClips(clientId, authToken, streamerId, 1);   
     displayClipsData(clipsDataForStreamer, containerId);
     console.log(clipsDataForStreamer);
    }
    
}

displayForYouCarousels();