export function displayClipsData(clipsDataForStreamer, containerId) {
    const embedUrls = clipsDataForStreamer.data.map((datum) => datum.embed_url);
    const thumbnailUrls = clipsDataForStreamer.data.map((datum) => datum.thumbnail_url);
    const titles = clipsDataForStreamer.data.map((datum) => datum.title);
    const languages = clipsDataForStreamer.data.map((datum) => datum.language);
    const viewCounts = clipsDataForStreamer.data.map((datum) => datum.view_count);
    const streamers = clipsDataForStreamer.data.map((datum) => datum.broadcaster_name);
    const streamerIds = clipsDataForStreamer.data.map((datum) => datum.broadcaster_id);
    const creationDateTimes = clipsDataForStreamer.data.map((datum) => datum.created_at);
    const durations = clipsDataForStreamer.data.map((datum) => datum.duration);
    
    const gameIds = clipsDataForStreamer.data.map((datum) => datum.game_id);


    const parentElement = document.getElementById(containerId);
    thumbnailUrls.forEach((thumbnailUrl, index) => {
        //const thumbnailElement = document.createElement('img');
        //thumbnailElement.src = thumbnailUrl;
        //parentElement.appendChild(thumbnailElement);

        const carouselItem = document.createElement('div');
        carouselItem.id = streamers[0] + index;
        carouselItem.className = "carousel-item"
  
        const card = document.createElement('div');
        card.className = "card";
        card.style.height = "300px";
  
        const imageWrapper = document.createElement('div');
        imageWrapper.className = "img-wrapper";
        imageWrapper.id = gameIds[index] + "img-wrapper" + index;
        imageWrapper.style.position = "relative";
  
        // formerly thumbnail
        const image = document.createElement('img');
        image.src = thumbnailUrl;
        image.classList.add('thumbnail');
        //image.addEventListener('click', () => {thumbnailClickListener(index, embedUrls, streamerIds, streamers)});
        //image.addEventListener('click', () => {highlightDiv(imageWrapper)});
  
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
  
        /*
        const cardTitle = document.createElement('h1');
        cardTitle.innerText = 'Card Title'
        cardTitle.style.color = "#6441A4"
        */
  
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
        //textElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Optional: for better visibility
        //textElement.style.color = 'white'; // Optional: to make text stand out
        //textElement.style.padding = '5px'; 
  
        parentElement.appendChild(carouselItem);
        carouselItem.appendChild(card);
        
        card.appendChild(imageWrapper);
        imageWrapper.appendChild(image);
        card.appendChild(cardBody);
        //cardBody.appendChild(cardTitle);
        cardBody.appendChild(clipTitle);
        cardBody.appendChild(streamer);
        imageWrapper.appendChild(duration);
        imageWrapper.appendChild(viewCount);
        imageWrapper.appendChild(creationDate);





    })

}