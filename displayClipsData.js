import { openPopUpPlayer } from "./openPopupPlayer";

export function displayClipsData(clipsDataForStreamer, containerId) {
    const thumbnailUrls = clipsDataForStreamer.data.map((datum) => datum.thumbnail_url);
    const titles = clipsDataForStreamer.data.map((datum) => datum.title);
    const viewCounts = clipsDataForStreamer.data.map((datum) => datum.view_count);
    const streamers = clipsDataForStreamer.data.map((datum) => datum.broadcaster_name);
    const creationDateTimes = clipsDataForStreamer.data.map((datum) => datum.created_at);
    const durations = clipsDataForStreamer.data.map((datum) => datum.duration);
    const embedUrls = clipsDataForStreamer.data.map((datum) => datum.embed_url);

    window.embedUrls.push(...embedUrls);
    
    const gameIds = clipsDataForStreamer.data.map((datum) => datum.game_id);

    const parentElement = document.getElementById(containerId);
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
        image.addEventListener('click', () => {openPopUpPlayer(index, embedUrls)})

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