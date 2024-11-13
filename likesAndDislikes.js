//display likes
const likedClipsUrls = JSON.parse(localStorage.getItem('liked-clips')) || [];
likedClipsUrls.forEach(url=> displayClip(url, 'likes-container'));

const dislikedClipsUrls = JSON.parse(localStorage.getItem('disliked-clips')) || [];
dislikedClipsUrls.forEach(url => displayClip(url, 'dislikes-container'));

const favoritedClipsUrls = JSON.parse(localStorage.getItem('favorited-clips')) || [];
favoritedClipsUrls.forEach(url => displayClip(url, 'favorites-container'));

/*
function displayClip(url, containerId) {  
    const iframe = document.createElement('iframe');
  
    iframe.src = url.replace("autoplay=true", "autplay=false");
  
    iframe.height = '360';
    iframe.width = '640';
    iframe.allowFullscreen = true;
    
    const likesContainer = document.getElementById(containerId);
    likesContainer.appendChild(iframe);
  
  }
*/

function displayClip(clipData, containerId) {
  const embedUrl = clipData.embed_url;
  const thumbnailUrl = clipData.thumbnail_url;
  const title = clipData.title;
  const language = clipData.language;
  const viewCount = clipData.view_count;
  const streamer = clipData.broadcaster_name;
  const streamerId = clipData.broadcaster_id;
  const creationDateTime = clipData.created_at;
  const duration = clipData.duration;
  const gameId = clipData.game_id;




  const carouselItem = document.createElement('div');
  //carouselItem.id = carouselName + index;
  carouselItem.className = "carousel-item"

  const card = document.createElement('div');
  card.className = "card";
  card.style.height = "300px";

  const imageWrapper = document.createElement('div');
  imageWrapper.className = "img-wrapper";
  //imageWrapper.id = gameId + "img-wrapper" + index;
  imageWrapper.style.position = "relative";

  // formerly thumbnail
  const image = document.createElement('img');
  image.src = thumbnailUrl + "?parent=localhost";
  image.classList.add('thumbnail');
  //image.addEventListener('click', () => {thumbnailClickListener(carouselName, index, embedUrls, streamerIds, streamers)});
  //image.addEventListener('click', () => {highlightDiv(imageWrapper)});

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  const clipTitle = document.createElement('p');
  clipTitle.innerText = title;
  clipTitle.style.color = "#FFFFFF";

  const viewCountElement = document.createElement('p');
  viewCountElement.innerText = viewCount.toLocaleString() + ' views';
  viewCountElement.style.color = "#FFFFFF";
  viewCountElement.style.position = 'absolute';
  viewCountElement.style.bottom = '0';
  viewCountElement.style.left = '0';

  const streamerElement = document.createElement('p');
  streamerElement.innerText = streamer;
  streamerElement.style.color = "#FFFFFF";

  const creationDate = document.createElement('p');
  creationDate.innerText = creationDateTime;
  creationDate.style.color = "#FFFFFF";
  creationDate.style.position = 'absolute';
  creationDate.style.bottom = '0';
  creationDate.style.right = '0';

  const durationElement = document.createElement('p');
  durationElement.innerText = Math.round(duration) + 's';
  durationElement.style.color = "#FFFFFF";

  durationElement.style.position = 'absolute';
  durationElement.style.top = '0';
  durationElement.style.left = '0';

  const parentContainer = document.getElementById(containerId);
  parentContainer.appendChild(carouselItem);
  carouselItem.appendChild(card);
  
  card.appendChild(imageWrapper);
  imageWrapper.appendChild(image);
  card.appendChild(cardBody);
  //cardBody.appendChild(cardTitle);
  cardBody.appendChild(clipTitle);
  cardBody.appendChild(streamerElement);
  imageWrapper.appendChild(durationElement);
  imageWrapper.appendChild(viewCountElement);
  imageWrapper.appendChild(creationDate);
}