import { getClips } from "./getClips";
import { displayClipsData } from "./displayClipsData";

async function displayForYouCarousels() {
    const followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};
    console.log(followedStreamers);

    const streamerEntries = Object.entries(followedStreamers);

    const containerId = 'container';
    const parentContainer = document.getElementById(containerId);

    for (const [streamer, streamerId] of streamerEntries) {
        const streamerContainer = document.createElement('div');
        streamerContainer.id = streamer + '-container';

        const streamerElement = document.createElement('p');
        streamerElement.textContent = streamer;

        streamerContainer.appendChild(streamerElement);

        parentContainer.appendChild(streamerContainer);

        const clipsDataForStreamer = await getClips(clientId, authToken, streamerId, 1);   
        displayClipsData(clipsDataForStreamer, streamerContainer.id);
        console.log(clipsDataForStreamer);
    }
    
}

displayForYouCarousels();