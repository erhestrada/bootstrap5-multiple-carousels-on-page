import { getClipsForStreamer } from "./getClips";

function displayForYouCarousels() {
    const followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};
    console.log(followedStreamers);

    for (const streamer in followedStreamers) {
     const clipsForStreamer = getClipsForStreamer(clientId, authToken, streamer, 1);   
    }
    // get clips in the last 24 hours for each streamer
}

displayForYouCarousels();