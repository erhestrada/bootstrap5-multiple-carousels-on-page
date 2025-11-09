import { getVotedOnClips, getFavoritedClips, getCommentedOnClips, getHistoryClips } from "./clips";
import { displayUserVoteOnClip } from "./display-user-vote-on-clip";
import { displayNetVotes } from "./display-net-votes";
import { displayFavoriteStatusOfClip } from "./display-favorite-status-of-clip";
import { displayComments } from "./display-comments";
import { getFollows, deleteStreamerFollow, patchSwapPositions } from './follows';

window.switchItems = [];

const usernameContainer = document.getElementById('profile-username-container');
usernameContainer.querySelector('h1').textContent = localStorage.getItem('username');

const userId = localStorage.getItem("userId");
console.log("userId", userId);

async function getUserClips() {
    //const commentedClips = await getCommentedClips(userId);
    const [ votedOnClips, favoritedClips, commentedOnClips, historyClips, follows ] = await Promise.all([getVotedOnClips(userId),
      getFavoritedClips(userId),
      getCommentedOnClips(userId),
      getHistoryClips(userId),
      getFollows(userId)]);
    const upvotedClips = votedOnClips.filter(clip => clip.vote === "upvote");
    const downvotedClips = votedOnClips.filter(clip => clip.vote === "downvote");

    console.log(follows);

    return [upvotedClips, downvotedClips, favoritedClips, commentedOnClips, historyClips, follows];
}

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


  const imageWrapper = document.createElement('div');
  imageWrapper.className = "img-wrapper";
  imageWrapper.style.position = "relative";

  const image = document.createElement('img');
  image.src = thumbnailUrl + "?parent=localhost";
  image.classList.add('thumbnail');
  image.addEventListener('click', () => { openPopUpPlayer(clipData) });

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  // Hold clipTitle and optionally redditIcon
  const titleWrapper = document.createElement('div');
  titleWrapper.style.display = 'flex';
  titleWrapper.style.gap = '6px';

  const clipTitle = document.createElement('p');
  clipTitle.className = 'clip-title';
  clipTitle.innerText = title;
  clipTitle.style.color = "#FFFFFF";

  const viewCountElement = document.createElement('p');
  viewCountElement.className = 'view-count';
  viewCountElement.innerText = viewCount.toLocaleString() + ' views';
  viewCountElement.style.color = "#FFFFFF";
  viewCountElement.style.position = 'absolute';
  viewCountElement.style.bottom = '0';
  viewCountElement.style.left = '0';

  const streamerElement = document.createElement('p');
  streamerElement.className = 'streamer';
  streamerElement.innerText = streamer;
  streamerElement.style.color = "#FFFFFF";

  const creationDate = document.createElement('p');
  creationDate.className = 'creation-date';
  creationDate.innerText = creationDateTime;
  creationDate.style.color = "#FFFFFF";
  creationDate.style.position = 'absolute';
  creationDate.style.bottom = '0';
  creationDate.style.right = '0';

  const durationElement = document.createElement('p');
  durationElement.className = 'duration';
  durationElement.innerText = Math.round(duration) + 's';
  durationElement.style.color = "#FFFFFF";
  durationElement.style.position = 'absolute';
  durationElement.style.top = '0';
  durationElement.style.left = '0';

  parentContainer.appendChild(carouselItem);
  carouselItem.appendChild(imageWrapper);
  imageWrapper.appendChild(image);

  carouselItem.appendChild(cardBody);
  titleWrapper.appendChild(clipTitle);
  cardBody.appendChild(titleWrapper);
  cardBody.appendChild(streamerElement);
  imageWrapper.appendChild(durationElement);
  imageWrapper.appendChild(viewCountElement);
  imageWrapper.appendChild(creationDate);
}

function openPopUpPlayer(clipData) {
  window.currentClip = clipData;
  const embedUrl = clipData.embed_url;

  openPopUp();
  embedIframe(embedUrl);
  displayUserVoteOnClip(userId, window.currentClip.twitchId);
  displayNetVotes(window.currentClip.twitchId);
  displayFavoriteStatusOfClip(userId, window.currentClip.twitchId);
  displayComments(window.currentClip.twitchId, userId);
}

function openPopUp() {
  document.getElementById('popup').style.display = 'block';
}

function closePopUp() {
  const popup = document.getElementById('popup');
  popup.style.display = 'none';
  
  const iframe = popup.querySelector('iframe');
  iframe.src = '';
}


function embedIframe(embedUrl) {
  const iframeContainer = document.getElementById('profile-iframe-container');
  const iframe = iframeContainer.querySelector('iframe');

  iframe.src = embedUrl + "&parent=localhost&autoplay=true";
  iframe.allowFullscreen = true;
  iframe.allow = "autoplay; fullscreen";

  // mute and don't add to history (only add unique clips so not spamming)

  // TODO: use aspect-ratio on container to enforce 16:9 ratio and avoid guessing
  // Tweaking to get right and avoid windowboxing
  iframe.style.width = "75%";
  iframe.style.height = "77%";

  iframeContainer.appendChild(iframe); // Makes first clip play with sound for some reason
}

document.querySelector('.close').addEventListener('click', closePopUp);

// Close the popup when clicking outside of it
window.onclick = function(event) {
  const popup = document.getElementById('popup');
  if (event.target == popup) {
      closePopUp();
  }
}

async function renderAllClips(upvotedClips, downvotedClips, favoritedClips, commentedOnClips, historyClips, follows) {
  const upvotedClipsContainer = document.getElementById('upvoted-clips-container');
  displayHistory(upvotedClips, upvotedClipsContainer);

  const downvotedClipsContainer = document.getElementById('downvoted-clips-container');
  displayHistory(downvotedClips, downvotedClipsContainer);

  const favoritedClipsContainer = document.getElementById('favorited-clips-container');
  displayHistory(favoritedClips, favoritedClipsContainer);

  const commentedOnClipsContainer = document.getElementById('commented-clips-container');
  displayHistory(commentedOnClips, commentedOnClipsContainer);

  const historyClipsContainer = document.getElementById('history-clips-container');
  displayHistory(historyClips, historyClipsContainer);
  
  const followingContainer = document.getElementById('following-container');
  displayFollows(follows, followingContainer);
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

const [upvotedClips, downvotedClips, favoritedClips, commentedOnClips, historyClips, follows] = await getUserClips();
renderAllClips(upvotedClips, downvotedClips, favoritedClips, commentedOnClips, historyClips, follows)
console.log('follows: ', follows);

// Display first tab when page opened
const upvotedClipsContainer = document.getElementById('upvoted-clips-container');
displayHistory(upvotedClips, upvotedClipsContainer);

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.tab;

    // Deactivate all buttons and tabs
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Activate clicked tab and its content
    button.classList.add('active');
    document.getElementById(targetId).classList.add('active');

    // Move the tab indicator
    moveIndicator(button);
  });
});

function displayFollows(follows, followsContainer) {
  followsContainer.innerHTML = '';
  const streamerFollows = follows.streamers;
  const categoryFollows = follows.categories;
  streamerFollows.forEach(({ streamer: name, twitch_id: id, profile_picture_url: thumbnailUrl, position}) => {
      const pfpUrl = thumbnailUrl;
      const streamerId = id;

      const searchResultElement = document.createElement('div');
      searchResultElement.classList.add('search-result');
      searchResultElement.style.cursor = "pointer";
      searchResultElement.name = name; // For api function
      searchResultElement.id = `following-item-${name}`;
      searchResultElement.position = position;

      const pfpElement = document.createElement('img');
      pfpElement.src = pfpUrl;

      pfpElement.classList.add('streamer-pfp');
      //pfpElement.classList.add('category-search-result-boxart');

      const streamerNameElement = document.createElement('p');
      streamerNameElement.innerText = name;
      streamerNameElement.classList.add('streamer-name');  // Add a class for styling

      const reorderButton = document.createElement('button');
      reorderButton.classList.add('following-page-btn');
      reorderButton.classList.add('reorder-btn');
      reorderButton.innerText = 'Reorder';
      reorderButton.addEventListener('click', () => handleReorder(searchResultElement));

      const unfollowButton = document.createElement('button');
      unfollowButton.classList.add('following-page-btn');
      unfollowButton.classList.add('following-page-unfollow-btn');
      unfollowButton.innerText = 'Unfollow';
      unfollowButton.addEventListener('click', () => showDeleteModal('unfollow-modal', searchResultElement, name, streamerId));

      searchResultElement.appendChild(pfpElement);
      searchResultElement.appendChild(streamerNameElement);
      searchResultElement.appendChild(reorderButton);
      searchResultElement.appendChild(unfollowButton);

      followsContainer.appendChild(searchResultElement);
  });

  categoryFollows.forEach(({ category: name, categoryId: id, boxArtUrl: thumbnailUrl}) => {
      const pfpUrl = thumbnailUrl.replace('{width}', '200').replace('{height}', '300');
      const streamerId = id;

      const searchResultElement = document.createElement('div');
      searchResultElement.classList.add('search-result');
      searchResultElement.style.cursor = "pointer";

      const pfpElement = document.createElement('img');
      pfpElement.src = pfpUrl;

      //pfpElement.classList.add('streamer-pfp');
      pfpElement.classList.add('category-search-result-boxart');

      const streamerNameElement = document.createElement('p');
      streamerNameElement.innerText = name;
      streamerNameElement.classList.add('streamer-name');  // Add a class for styling

      const followButton = document.createElement('button');
      followButton.innerText = 'Follow';
      followButton.addEventListener('click', () => followStreamer(name, streamerId));

      searchResultElement.appendChild(pfpElement);
      searchResultElement.appendChild(streamerNameElement);

      followsContainer.appendChild(searchResultElement);
  });
}


const deleteCancelButton = document.querySelector('.delete-modal-btn.delete-cancel');
deleteCancelButton.addEventListener('click', () => hideDeleteModal('unfollow-modal'));

const modalUnfollowButton = document.getElementById('modal-unfollow-btn');
modalUnfollowButton.addEventListener('click', () => handleUnfollow(window.modalId, window.searchResultElement, userId, window.name, window.streamerId));

function showDeleteModal(id, searchResultElement, name, streamerId) {
    const modal = document.getElementById(id);
    modal.classList.add('show');

    const modalTitle = modal.querySelector('.delete-modal-title');
    modalTitle.innerText = `Unfollow ${name}`;

    const modalText = modal.querySelector('.delete-modal-text');
    modalText.innerText = `Are you sure you want to unfollow ${name}?`;

    window.modalId = id;
    window.searchResultElement = searchResultElement;
    window.name = name;
    window.streamerId = streamerId;
}

function hideDeleteModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('show');
}

function handleUnfollow(modalId, searchResultElement, userId, name, streamerId) {
  searchResultElement.remove();
  deleteStreamerFollow(userId, name, streamerId);
  hideDeleteModal(modalId);
}

function handleReorder(searchResultElement) {
  // If element not in window.switchItems, add it and highlight the element
  if (!window.switchItems.some(item => item.id === searchResultElement.id)) {
    searchResultElement.style.border = '1px solid red';
    window.switchItems.push(searchResultElement);

    // When two elements are selected switch their positions, remove their highlights, and reset window.switchItems
    if (window.switchItems.length === 2) {
      swapElements(window.switchItems[0], window.switchItems[1]);
      for (const item of switchItems) {
        item.style.border = 'none';
      }
      window.switchItems = [];
    }
  // If element in window.switchItems, remove it from window.switchItems and remove its highlight
  } else {
    searchResultElement.style.border = 'none';
    window.switchItems = window.switchItems.filter(item => item.id !== searchResultElement.id);
  }
}

function swapElements(el1, el2) {
  const parent = el1.parentNode;
  const sibling = el1.nextSibling === el2 ? el1 : el1.nextSibling;
  parent.insertBefore(el1, el2);
  parent.insertBefore(el2, sibling);

  const el1StartPosition = el1.position;
  el1.position = el2.position;
  el2.position = el1StartPosition;

  console.log("Element 1 position: ", el1.position);
  console.log("Element 2 position: ", el2.position);

  const followType = 'streamers';
  patchSwapPositions(userId, followType, el1.name, el2.name);
}



function displayHistory(clips, container) {
  for (const clip of clips) {
    const { clipElement } = makeHistoryRow(clip, container);
    container.prepend(clipElement);    
  }
}



function makeHistoryRow(clip) {
  const embedUrl = clip.embed_url;
  const viewCounts = clip.view_count;
  const creationDateTimes = clip.created_at;

  // Create outer row container
  const row = document.createElement('div');
  row.className = "playlist-row";
  row.style.display = "flex";
  row.style.alignItems = "flex-start";
  row.style.marginBottom = "10px";
  row.addEventListener('click', () => { openPopUpPlayer(clip) });

  // Thumbnail wrapper
  const thumbWrapper = document.createElement('div');
  thumbWrapper.className = 'playlist-thumb-wrapper';
  thumbWrapper.style.position = "relative";
  thumbWrapper.style.flex = "0 0 168px"; // Similar to YouTube's playlist thumbnail width
  thumbWrapper.style.marginRight = "10px";

  const thumb = document.createElement('img');
  thumb.src = clip.thumbnail_url + "?parent=localhost";
  thumb.classList.add('thumbnail');
  thumb.style.width = "100%";
  thumb.style.cursor = "pointer";

  // Duration overlay
  const durationOverlay = document.createElement('span');
  durationOverlay.innerText = Math.round(clip.duration) + 's';
  durationOverlay.style.position = 'absolute';
  durationOverlay.style.bottom = '4px';
  durationOverlay.style.right = '4px';
  durationOverlay.style.background = 'rgba(0, 0, 0, 0.75)';
  durationOverlay.style.color = '#fff';
  durationOverlay.style.padding = '2px 4px';
  durationOverlay.style.fontSize = '12px';
  durationOverlay.style.borderRadius = '2px';

  // Right-side info column
  const infoCol = document.createElement('div');
  infoCol.className = 'info-col';
  infoCol.style.flex = "1";

  const titleEl = document.createElement('p');
  titleEl.innerText = clip.title;
  titleEl.style.margin = "0";
  titleEl.style.fontWeight = "bold";
  titleEl.style.color = "#FFFFFF";
  titleEl.style.cursor = "pointer";

  const streamerEl = document.createElement('p');
  streamerEl.innerText = clip.broadcaster_name;
  streamerEl.style.margin = "2px 0 0 0";
  streamerEl.style.color = "#AAAAAA";
  streamerEl.style.fontSize = "14px";

  // Append elements
  thumbWrapper.appendChild(thumb);
  thumbWrapper.appendChild(durationOverlay);
  infoCol.appendChild(titleEl);
  infoCol.appendChild(streamerEl);
  row.appendChild(thumbWrapper);
  row.appendChild(infoCol);

  return { clipElement: row };
}
