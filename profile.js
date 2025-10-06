import { getVotedOnClips } from "./clips";
import { closePopUp } from "./getTopClipsBrowse";

const usernameContainer = document.getElementById('profile-username-container');
usernameContainer.querySelector('h1').textContent = localStorage.getItem('username');

const userId = localStorage.getItem("userId");
console.log("userId", userId);
displayUpvotedClips(userId);

function displayClip(clipData, parentContainer) {
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
  carouselItem.className = "carousel-element";
  carouselItem.style.cssText = `
      width: fit-content !important;
      display: inline-block !important;
      vertical-align: top !important;
      flex: none !important;
  `;

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

async function displayUpvotedClips(userId) {
  const userClips = await getVotedOnClips(userId);
  const upvotedClips = userClips.filter(clip => clip.vote === "upvote");
  console.log('user clips', userClips);
  const upvotedClipsContainer = document.getElementById('upvoted-clips-container');
  for (const userClip of upvotedClips) {
    displayClip(userClip, upvotedClipsContainer);
  }
}

async function displayDownvotedClips(userId) {
  const userClips = await getVotedOnClips(userId);
  const downvotedClips = userClips.filter(clip => clip.vote === "downvote");
  const downvotedClipsContainer = document.getElementById('downvoted-clips-container');
  for (const userClip of downvotedClips) {
    displayClip(userClip, downvotedClipsContainer);
  }
}

async function displayFavoritedClips(userId) {
  const favoritedClips = await getFavoritedClips(userId);
  const favoritedClipsContainer = document.getElementById('favorited-clips-container');
  for (const clip of favoritedClips) {
    displayClip(clip, favoritedClipsContainer);
  }
}

async function displayCommentedClips(userId) {
  const commentedClips = await getCommentedClips(userId);
  const commentedClipsContainer = document.getElementById('commented-clips-container');
  for (const clip of commentedClips) {
    displayClip(clip, commentedClipsContainer);
  }
}


// -------------------------
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const tabIndicator = document.querySelector('.tab-indicator');

function moveIndicator(el) {
  const buttonRect = el.getBoundingClientRect();
  const containerRect = el.parentElement.getBoundingClientRect();

  const offsetLeft = buttonRect.left - containerRect.left;
  const width = buttonRect.width;

  tabIndicator.style.transform = `translateX(${offsetLeft}px)`;
  tabIndicator.style.width = `${width}px`;
}

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.tab;

    // Deactivate all buttons and tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Activate clicked tab and its content
    button.classList.add('active');
    document.getElementById(targetId).classList.add('active');

    // It makes more sense to just do display = none that way you don't have to reload
    if (targetId === "upvoted-clips-container") {
      displayUpvotedClips(userId);
    } else if (targetId === "downvoted-clips-container") {
      displayDownvotedClips(userId);
    } else if (targetId === "favorited-clips-container") {
      displayFavoritedClips(userId);
    } else if (targetId === "commented-clips-container") {
      displayCommentedClips(userId);
    }

    // Move the tab indicator
    moveIndicator(button);
  });
});
