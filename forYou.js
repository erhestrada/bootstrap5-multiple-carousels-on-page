import { getClips } from "./getClips";
import { displayClipsData } from "./displayClipsData";
import { closePopUp } from "./getTopClipsBrowse";
import { saveClip } from "./saveClip";

async function displayForYouCarousels() {
    const followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};

    const streamerEntries = Object.entries(followedStreamers);

    const containerId = 'for-you-container';
    const parentContainer = document.getElementById(containerId);

    displayFollowsList(streamerEntries);

    window.embedUrls = {};

    console.log(streamerEntries);
    
    for (const [streamer, streamerId] of streamerEntries) {    
        const clipsDataForStreamer = await getClips(clientId, authToken, streamerId, 1);   
        const numberOfClips = clipsDataForStreamer.data.length;
        if (numberOfClips > 0) {
            playFirstClip(clipsDataForStreamer);

            const streamerContainer = document.createElement('div');
            streamerContainer.id = streamer + '-container';
    
            streamerContainer.style.display = 'flex';
            streamerContainer.style.flexWrap = 'wrap';
            streamerContainer.style.gap = '10px';
    
            const streamerElement = document.createElement('p');
            streamerElement.textContent = streamer;
    
            streamerContainer.appendChild(streamerElement);
    
            parentContainer.appendChild(streamerContainer);

            displayClipsData(clipsDataForStreamer, streamerContainer.id);

            break;
        }
        
    }   
}

function playFirstClip(clipsData) {
    const firstEmbedUrl = clipsData.data[0].embed_url;

    const iframeContainer = document.getElementById('for-you-iframe-container');
    const iframe = document.createElement('iframe');

    iframe.src = firstEmbedUrl + "&parent=localhost&autoplay=true";
    iframe.height = 360;
    iframe.width = 640;
    iframe.allowFullscreen = true;
  
    iframeContainer.appendChild(iframe);
}



function displayFollowsList(streamerEntries) {
    const followList = document.getElementById('follow-list');

    for (const [streamer, streamerId] of streamerEntries) {        
        const followEntry = document.createElement('li');
        followEntry.innerText = streamer;
        followList.appendChild(followEntry);
    }   
}

displayForYouCarousels();
//document.querySelector('.close').addEventListener('click', closePopUp);
//document.getElementById('favorite-button').addEventListener('click', () => saveClip("favorited-clips"));
