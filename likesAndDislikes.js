import { closePopUp } from "./getTopClipsBrowse";

const upvotedClips = JSON.parse(localStorage.getItem('upvotedClips')) || [];
console.log('hey', upvotedClips);
upvotedClips.forEach(clip => displayClip(clip, 'likes-container'));

const downvotedClips = JSON.parse(localStorage.getItem('downvotedClips')) || [];
downvotedClips.forEach(clip => displayClip(clip, 'dislikes-container'));

const favoritedClips = JSON.parse(localStorage.getItem('favoritedClips')) || [];
favoritedClips.forEach(clip => displayClip(clip, 'favorites-container'));

function displayClip(clipData, containerId) {
  const embedUrl = clipData.embed_url;
  console.log(embedUrl);
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
  //image.addEventListener('click', () => {highlightDiv(imageWrapper)});
  image.addEventListener('click', () => {openPopUpPlayer(embedUrl)})


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


function openPopUpPlayer(embedUrl) {
  openPopUp();
  embedIframe(embedUrl + "&parent=localhost&autoplay=true");
}

function openPopUp() {
  document.getElementById('popup').style.display = 'block';
}

function embedIframe(url) {
  localStorage.setItem('currentClipUrl', url);
  const iframeContainer = document.getElementById('iframe-container');
  iframeContainer.innerHTML = ''; // Clear previous content

  const iframe = document.createElement('iframe');
  iframe.src = url; // Set the iframe source
  iframe.style.width = 640; // Set width
  iframe.style.height = 360; // Set height
  iframe.frameBorder = 0;
  iframe.allowFullscreen = true;

  iframe.style.width = '100%'; // Full width of the container
  iframe.style.height = '100%'; // Full height of the container

  iframeContainer.appendChild(iframe); // Append the iframe to the container
}

document.querySelector('.close').addEventListener('click', closePopUp);

// Close the popup when clicking outside of it
window.onclick = function(event) {
  const popup = document.getElementById('popup');
  if (event.target == popup) {
      closePopUp();
  }
}