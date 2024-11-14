
// rename to displayStreamerForYouClipsData
export function displayClipsData(clipsDataForStreamer, containerId) {
    let forYouClipsData = JSON.parse(localStorage.getItem('forYouClipsData')) || {};
    forYouClipsData = updateForYouClipsData(clipsDataForStreamer.data, forYouClipsData);
    console.log(forYouClipsData);

    const thumbnailUrls = clipsDataForStreamer.data.map((datum) => datum.thumbnail_url);
    const titles = clipsDataForStreamer.data.map((datum) => datum.title);
    const viewCounts = clipsDataForStreamer.data.map((datum) => datum.view_count);
    const streamers = clipsDataForStreamer.data.map((datum) => datum.broadcaster_name);
    const creationDateTimes = clipsDataForStreamer.data.map((datum) => datum.created_at);
    const durations = clipsDataForStreamer.data.map((datum) => datum.duration);
    const embedUrls = clipsDataForStreamer.data.map((datum) => datum.embed_url);

    window.embedUrls[streamers[0]] = embedUrls;
    
    const gameIds = clipsDataForStreamer.data.map((datum) => datum.game_id);

    const parentElement = document.getElementById(containerId);
    parentElement.innerHTML = '';
    thumbnailUrls.forEach((thumbnailUrl, index) => {

        const carouselItem = document.createElement('div');
        carouselItem.id = streamers[0] + index;
        carouselItem.className = "carousel-item"

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


// keeps adding same clips to clips data?
function updateForYouClipsData(clipsDataForStreamer, forYouClipsData) {
    const streamer = clipsDataForStreamer[0].broadcaster_name;
    if (!(streamer in forYouClipsData)) {
        forYouClipsData[streamer] = {
            'newClipsData': clipsDataForStreamer,
            'oldClipsData': []
        };
        localStorage.setItem('forYouClipsData', JSON.stringify(forYouClipsData));
        return forYouClipsData;
    } else {
        for (const clipData of clipsDataForStreamer) {
            // it was already in New Clips last time i viewed streamer's clips
            if (forYouClipsData[streamer]['newClipsData'].some(item => item.id === clipData.id)) {
                console.log('move from new to old', clipData.id);
                // remove clipData from newClipsData
                const indexToRemove = forYouClipsData[streamer]['newClipsData'].indexOf(clipData);
                forYouClipsData[streamer]['newClipsData'].splice(indexToRemove, 1);
                // add clipData to oldClipsData
                forYouClipsData[streamer]['oldClipsData'].push(clipData);
            } else {         
                console.log('add new clip', clipData.id);       
                forYouClipsData[streamer]['newClipsData'].push(clipData);
            }
        }
        localStorage.setItem('forYouClipsData', JSON.stringify(forYouClipsData));
        return forYouClipsData;
    }
}