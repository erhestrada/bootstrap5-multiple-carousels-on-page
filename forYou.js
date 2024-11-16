import { getClips } from "./getClips";
import { displayClipsInStreamerInbox } from "./displayClipsData";
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
        let timesOfLastRequests = JSON.parse(localStorage.getItem('timesOfLastRequests')) || {};
        
        let timeOfLastRequest;
        if (streamer in timesOfLastRequests) {
            timeOfLastRequest = timesOfLastRequests[streamer];
        } else {
            timeOfLastRequest = new Date();  // Current date and time
            timeOfLastRequest.setHours(timeOfLastRequest.getHours() - 24);  // Subtract 24 hours
            timeOfLastRequest = timeOfLastRequest.toISOString(); // Convert to ISO string
        }

        const newTimeOfLastRequest = new Date(); 
        const clipsDataForStreamer = await getClips(clientId, authToken, streamerId, false, timeOfLastRequest);   
        addClipsFromRequestToInbox(streamer, clipsDataForStreamer.data);

        timesOfLastRequests[streamer] = newTimeOfLastRequest.toISOString();
        localStorage.setItem('timesOfLastRequests', JSON.stringify(timesOfLastRequests));

        const streamerInboxes = JSON.parse(localStorage.getItem('streamerInboxes')) || {};
        
        const newClipsInStreamerInbox = streamerInboxes[streamer]?.newClipsData || [];        
        const numberOfNewClipsInStreamerInbox = newClipsInStreamerInbox.length;

        console.log(numberOfNewClipsInStreamerInbox);

        const streamerInbox = document.getElementById(streamer + '-inbox');
        if (streamerInbox) {
            // Create a new <span> element for the red circle
            const clipCountBadge = document.createElement('span');
            
            const viewedClips = streamerInboxes[streamer]?.oldClipsData || [];

            // red badge should display unviewedClips from request + unviewedClips from inbox
            if (newClipsInStreamerInbox.length > 0) {
                clipCountBadge.innerText = newClipsInStreamerInbox.length + '|' + viewedClips.length;
                clipCountBadge.style.backgroundColor = 'red';  // Red background
            } else {
                if (viewedClips.length > 0) {
                    clipCountBadge.innerText = newClipsInStreamerInbox.length + '|' + viewedClips.length;
                    clipCountBadge.style.backgroundColor = 'grey';  // Grey background
                }
            }
            
            if (newClipsInStreamerInbox.length > 0 || viewedClips.length > 0) {
                // Apply CSS to style the red circle
                clipCountBadge.style.display = 'inline-block';  // To place it next to the text
                clipCountBadge.style.width = '20px';  // Size of the circle
                clipCountBadge.style.height = '20px'; // Size of the circle
                clipCountBadge.style.borderRadius = '50%';  // Make it circular
                clipCountBadge.style.color = 'white';  // White text inside the circle
                clipCountBadge.style.textAlign = 'center';  // Center the text inside the circle
                clipCountBadge.style.lineHeight = '20px';  // Vertically center the text
                clipCountBadge.style.fontSize = '12px';  // Font size for the number
                clipCountBadge.style.marginLeft = '5px';  // Add some space between the text and the circle
                
                // Append the badge to the streamerInbox element
                streamerInbox.appendChild(clipCountBadge);
            }

            // is clipsDataForStreamer right?
            streamerInbox.addEventListener('click', () => displayClipsInStreamerInbox(streamer));
            
        }

        if (numberOfNewClipsInStreamerInbox > 0 && firstStreamerWithClipsFound === false) {
            playFirstClip(newClipsInStreamerInbox);

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

            displayClipsInStreamerInbox(streamer);

            firstStreamerWithClipsFound = true;
        }

        
    }   
}

function addClipsFromRequestToInbox(streamer, clipsData) {
    let streamerInboxes = JSON.parse(localStorage.getItem('streamerInboxes')) || {};
    if (!(streamer in streamerInboxes)) {
        streamerInboxes[streamer] = {
            'newClipsData': clipsData,
            'oldClipsData': []
        };
        localStorage.setItem('streamerInboxes', JSON.stringify(streamerInboxes));
        return streamerInboxes;
    } else {
        // append - call clips from request will be new because of the time parameter
        streamerInboxes[streamer]['newClipsData'] = streamerInboxes[streamer]['newClipsData'].concat(clipsData);
        localStorage.setItem('streamerInboxes', JSON.stringify(streamerInboxes));
        return streamerInboxes;
    }
}

function playFirstClip(clipsData) {
    const firstEmbedUrl = clipsData[0].embed_url;

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
