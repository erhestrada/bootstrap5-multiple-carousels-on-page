import { getClips } from "./getClips";
import { displayClipsData } from "./displayClipsData";
import { saveClip } from "./saveClip";
import { openTab } from "./openTab";

async function displayForYouPlayerAndThumbnails() {
    const followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};

    const streamerEntries = Object.entries(followedStreamers);

    const containerId = 'new-clips-container';
    const parentContainer = document.getElementById(containerId);

    displayFollowsList(streamerEntries);

    window.embedUrls = {};
    
    let firstStreamerWithClipsFound = false;
    for (const [streamer, streamerId] of streamerEntries) {    
        const clipsDataForStreamer = await getClips(clientId, authToken, streamerId, 1);   
        const numberOfClips = clipsDataForStreamer.data.length;
        if (numberOfClips > 0 && firstStreamerWithClipsFound === false) {
            playFirstClip(clipsDataForStreamer);

            const streamerContainer = document.createElement('div');
            //streamerContainer.id = streamer + '-container';
            streamerContainer.id = 'streamer-clips-container';
    
            streamerContainer.style.display = 'flex';
            streamerContainer.style.flexWrap = 'wrap';
            streamerContainer.style.gap = '10px';
    
            const streamerElement = document.createElement('p');
            streamerElement.textContent = streamer;
    
            streamerContainer.appendChild(streamerElement);
    
            parentContainer.appendChild(streamerContainer);

            displayClipsData(clipsDataForStreamer, streamerContainer.id);

            firstStreamerWithClipsFound = true;
        }

        const streamerInbox = document.getElementById(streamer + '-inbox');
        if (streamerInbox) {
            if (numberOfClips > 0) {
                // Create a new <span> element for the red circle
                const clipCountBadge = document.createElement('span');
                
                // Set the text of the badge to the number of clips
                const forYouClipsData = JSON.parse(localStorage.getItem('forYouClipsData')) || {};
                const formattedStreamer = clipsDataForStreamer.data[0].broadcaster_name;
                const viewedClips = forYouClipsData[formattedStreamer]['oldClipsData'];
                const viewedClipsIds = viewedClips.map(viewedClip => viewedClip.id);
                const unviewedClips = clipsDataForStreamer.data.filter(clip => !viewedClipsIds.includes(clip.id));

                clipCountBadge.innerText = unviewedClips.length;
                
                // Apply CSS to style the red circle
                clipCountBadge.style.display = 'inline-block';  // To place it next to the text
                clipCountBadge.style.width = '20px';  // Size of the circle
                clipCountBadge.style.height = '20px'; // Size of the circle
                clipCountBadge.style.borderRadius = '50%';  // Make it circular
                clipCountBadge.style.backgroundColor = 'red';  // Red background
                clipCountBadge.style.color = 'white';  // White text inside the circle
                clipCountBadge.style.textAlign = 'center';  // Center the text inside the circle
                clipCountBadge.style.lineHeight = '20px';  // Vertically center the text
                clipCountBadge.style.fontSize = '12px';  // Font size for the number
                clipCountBadge.style.marginLeft = '5px';  // Add some space between the text and the circle
                
                // Append the badge to the streamerInbox element
                streamerInbox.appendChild(clipCountBadge);
                
                streamerInbox.addEventListener('click', () => displayClipsData(clipsDataForStreamer, 'streamer-clips-container'));
            }


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
        followEntry.id = streamer + '-inbox';
        followEntry.innerText = streamer;
        followList.appendChild(followEntry);
    }   
}

displayForYouPlayerAndThumbnails();
document.getElementById('new-clips-tab').addEventListener('click', (e) => openTab(e, 'new-clips-container'));
document.getElementById('old-clips-tab').addEventListener('click', (e) => openTab(e, 'old-clips-container'));
