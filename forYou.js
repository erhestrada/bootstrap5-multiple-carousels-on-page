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
        timesOfLastRequests[streamer] = newTimeOfLastRequest.toISOString();
        localStorage.setItem('timesOfLastRequests', JSON.stringify(timesOfLastRequests));

        console.log(streamer);
        console.log('timesOfLastRequests', timesOfLastRequests);

        const numberOfClipsInResponse = clipsDataForStreamer.data.length;
        console.log('number of clips in response: ', numberOfClipsInResponse);


        // i need streamer to be in the right capitalization format - fix in search
        const forYouClipsData = JSON.parse(localStorage.getItem('forYouClipsData')) || {};
        console.log('forYouClipsData', forYouClipsData);
        
        const numberOfNewClipsInInbox = forYouClipsData[streamer]?.newClipsData?.length || 0;
        console.log('number of new clips in inbox: ', numberOfNewClipsInInbox);

        const numberOfOldClipsInInbox = forYouClipsData[streamer]?.oldClipsData?.length || 0;
        console.log('number of old clips in inbox: ', numberOfOldClipsInInbox);

        const unviewedClipsInInbox = forYouClipsData[streamer]?.newClipsData || [];
        const clipsInResponse = clipsDataForStreamer.data;
        const unviewedClipsData = [...clipsInResponse, ...unviewedClipsInInbox];
        const numberOfUnviewedClips = numberOfNewClipsInInbox + numberOfClipsInResponse;
        
        console.log('number of unviewed clips:', numberOfUnviewedClips);
        
        if (numberOfUnviewedClips > 0 && firstStreamerWithClipsFound === false) {
            console.log(unviewedClipsData);
            playFirstClip(unviewedClipsData);

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

            console.log('unviewedClipsData', unviewedClipsData);
            displayClipsData(streamer, unviewedClipsData);

            firstStreamerWithClipsFound = true;
        }

        const streamerInbox = document.getElementById(streamer + '-inbox');
        if (streamerInbox) {
            // Create a new <span> element for the red circle
            const clipCountBadge = document.createElement('span');
            
            // Set the text of the badge to the number of clips
            const forYouClipsData = JSON.parse(localStorage.getItem('forYouClipsData')) || {};
            // dont need to use formattedStreamer anymore - changed how i'm storing names
            //const formattedStreamer = clipsDataForStreamer.data[0].broadcaster_name;
            const viewedClips = forYouClipsData[streamer]?.oldClipsData || [];
            const viewedClipsIds = viewedClips.map(viewedClip => viewedClip.id);
            const unviewedClips = clipsDataForStreamer.data.filter(clip => !viewedClipsIds.includes(clip.id));

            if (unviewedClips.length > 0) {
                clipCountBadge.innerText = unviewedClips.length;
                clipCountBadge.style.backgroundColor = 'red';  // Red background
            } else {
                if (viewedClips.length > 0) {
                    clipCountBadge.innerText = viewedClips.length;
                    clipCountBadge.style.backgroundColor = 'grey';  // Grey background
                }
            }
            
            if (unviewedClips.length > 0 || viewedClips.length > 0) {
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
            streamerInbox.addEventListener('click', () => displayClipsData(streamer, clipsDataForStreamer.data));
            
        }
        
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
