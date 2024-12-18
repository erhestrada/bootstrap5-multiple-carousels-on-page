
// clipsData = newClipsInStreamerInbox
export function displayClipsInStreamerInbox(streamer) {
    let streamerInboxes = JSON.parse(localStorage.getItem('streamerInboxes')) || {};

    displayClipsInTab(streamer, streamerInboxes[streamer]['newClipsData'], 'new-clips-container')
    displayClipsInTab(streamer, streamerInboxes[streamer]['oldClipsData'], 'old-clips-container')

    moveClipsFromNewToOld(streamer, streamerInboxes);
}

function displayClipsInTab(streamer, clipsDataForStreamer, containerId) {
    const thumbnailUrls = clipsDataForStreamer.map((datum) => datum.thumbnail_url);
    const titles = clipsDataForStreamer.map((datum) => datum.title);
    const viewCounts = clipsDataForStreamer.map((datum) => datum.view_count);
    const streamers = clipsDataForStreamer.map((datum) => datum.broadcaster_name);
    const creationDateTimes = clipsDataForStreamer.map((datum) => datum.created_at);
    const durations = clipsDataForStreamer.map((datum) => datum.duration);
    const embedUrls = clipsDataForStreamer.map((datum) => datum.embed_url);

    window.embedUrls[streamers[0]] = embedUrls;
    
    const gameIds = clipsDataForStreamer.map((datum) => datum.game_id);

    const parentElement = document.getElementById(containerId);
    parentElement.innerHTML = '';
    if (clipsDataForStreamer.length === 0) {
        const messageElement = document.createElement('p');
        if (containerId === "new-clips-container") {
            messageElement.innerText = streamer + ' ' + 'No New Clips';
        } else {
            messageElement.innerText = streamer + ' ' + "No Old Clips";
        }
        parentElement.appendChild(messageElement);
    } else {
        thumbnailUrls.forEach((thumbnailUrl, index) => {

            const carouselItem = document.createElement('div');
            carouselItem.id = streamers[0] + index;
            carouselItem.className = "carousel-item";
    
            carouselItem.style.flex = '1 1 200px'; // Flex-grow, flex-shrink, and base width
            carouselItem.style.padding = '20px';
            carouselItem.style.textAlign = 'center';
            carouselItem.style.boxSizing = 'border-box'; // Ensure padding and border are included
      
            const card = document.createElement('div');
            card.className = "card";
            card.style.height = "300px";
      
            const imageWrapper = document.createElement('div');
            imageWrapper.className = "img-wrapper";
            imageWrapper.id = gameIds[index] + "img-wrapper" + index;
            imageWrapper.style.position = "relative";
      
            const image = document.createElement('img');
            //image.addEventListener('click', () => {openPopUpPlayer(streamers[0], index, embedUrls)})
            image.addEventListener('click', () => {playClip(embedUrls, index)})
    
            image.src = thumbnailUrl;
            image.classList.add('thumbnail');
            //image.addEventListener('click', () => {thumbnailClickListener(index, embedUrls, streamerIds, streamers)});
            //image.addEventListener('click', () => {highlightDiv(imageWrapper)});
      
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
      
            const clipTitle = document.createElement('p');
            clipTitle.innerText = titles[index];
            clipTitle.style.color = "#FFFFFF";
      
            const viewCount = document.createElement('p');
            viewCount.innerText = viewCounts[index].toLocaleString() + ' views';
            viewCount.style.color = "#FFFFFF";
            viewCount.style.position = 'absolute';
            viewCount.style.bottom = '0';
            viewCount.style.left = '0';
      
            const streamer = document.createElement('p');
            streamer.innerText = streamers[index];
            streamer.style.color = "#FFFFFF";
      
            const creationDate = document.createElement('p');
            creationDate.innerText = creationDateTimes[index];
            creationDate.style.color = "#FFFFFF";
            creationDate.style.position = 'absolute';
            creationDate.style.bottom = '0';
            creationDate.style.right = '0';
      
            const duration = document.createElement('p');
            duration.innerText = Math.round(durations[index]) + 's';
            duration.style.color = "#FFFFFF";
      
            duration.style.position = 'absolute';
            duration.style.top = '0';
            duration.style.left = '0';
      
            parentElement.appendChild(carouselItem);
            carouselItem.appendChild(card);
            
            card.appendChild(imageWrapper);
            imageWrapper.appendChild(image);
            card.appendChild(cardBody);
            cardBody.appendChild(clipTitle);
            cardBody.appendChild(streamer);
            imageWrapper.appendChild(duration);
            imageWrapper.appendChild(viewCount);
            imageWrapper.appendChild(creationDate);
        })
    }
}

function playClip(embedUrls, index) {
    const embedUrl = embedUrls[index];

    const iframeContainer = document.getElementById('for-you-iframe-container');
    
    iframeContainer.innerHTML = '';
    const iframe = document.createElement('iframe');

    iframe.src = embedUrl + "&parent=localhost&autoplay=true";
    iframe.height = 360;
    iframe.width = 640;
    iframe.allowFullscreen = true;
  
    iframeContainer.appendChild(iframe);
}

function moveClipsFromNewToOld(streamer, streamerInboxes) {
    //streamerInboxes[streamer].oldClipsData = streamerInboxes[streamer].oldClipsData.concat(streamerInboxes[streamer].newClipsData)
    // keep oldClipsData from accumulating infinitely
    if(streamerInboxes[streamer].newClipsData.length > 0) {
        streamerInboxes[streamer].oldClipsData = streamerInboxes[streamer].newClipsData;
    }
    streamerInboxes[streamer].newClipsData = [];
    localStorage.setItem('streamerInboxes', JSON.stringify(streamerInboxes));
    return streamerInboxes;
}
