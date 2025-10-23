import { updateDonutPfp } from "./updateDonutPfp";
import { updateStreamerBarCarousel } from "./updateStreamerBarCarousel";
import { showClipPlayer } from "./toggleClipPlayer";
import { SmartCarousel } from "./smartCarousel";
import { makeCarouselId } from "./makeNewCarouselForCategory";
import { getGameFromId } from "./getGameFromId";
import { displayFollowStatus } from "./display-follow-status";
import { loadClipInteractions } from "./loadClipInteractions";
import { displayNetVotes } from "./display-net-votes";
import { displayUserVoteOnClip } from "./display-user-vote-on-clip";
import { displayFavoriteStatusOfClip } from "./display-favorite-status-of-clip";
import { displayComments } from "./display-comments";
import { checkRedditPosts } from "./checkRedditPosts";
import { postClipToHistory } from "./history";
import { postClip } from "./postClip";

const gameToIdConverter = {
    "IRL": "509672",
    "Just Chatting": "509658",
    "World of Warcraft": "18122",
    "League of Legends": "21779",
    "Grand Theft Auto V": "32982",
    "VALORANT": "516575",
    "EA Sports FC 25": "2011938005",
    "Minecraft": "27471",
    "Throne and Liberty": "19801",
    "Fortnite": "33214",
    "Counter-Strike": "32399",
    "World of Warcraft": "18122",
    "Twitch All categories / multiple categories": "509658",
    "Games + Demos" :"66082",
    "Overwatch 2": "515025",
    "Apex Legends": "511224",
    "Call of Duty: Warzone": "512710",
    "Fast Food Simulator": "636259108",
    "Virtual Casino": "29452",
    "Diablo IV": "515024",
    "Tom Clancy's Rainbow Six Siege": "460630",
    "Silent Hill 2": "2058570718",
    "DRAGON BALL: Sparking! ZERO": "400407464",
    "ASMR": "509659",
    "Dead by Daylight": "491487",
    "Hearthstone": "138585",
    "New World: Aeternum": "493597",
    "Dota 2": "29595",
    "Five Hearts Under One Roof": "1534124527"

  }

function makeGetUrl(game, daysBack, broadcasterName = false, gameId=false) {
    if (!gameId) {
      gameId = gameToIdConverter[game];
    }
    const currentDateTime = getCurrentDateTime();
    const pastDateTime = getPastDateTime(daysBack);
    // haven't finished implementing this
    if (broadcasterName) {
      return "https://api.twitch.tv/helix/clips?game_id=" + gameId + "&started_at=" + pastDateTime + "&ended_at=" + currentDateTime + "&is_featured=false" + "&first=100";  
    }
    else {
      return "https://api.twitch.tv/helix/clips?game_id=" + gameId + "&started_at=" + pastDateTime + "&ended_at=" + currentDateTime + "&is_featured=false" + "&first=100";  
    }
  }
  
export function getCurrentDateTime() {
  const dateTime = new Date();
  const rfcDateTime = dateTime.toISOString();
  return rfcDateTime;
}
  
export function getPastDateTime(daysBack) {
  const hoursBack = daysBack * 24;
  const dateTime = new Date();
  const pastDateTime = new Date(dateTime.getTime() - hoursBack * 60 * 60 * 1000);
  const pastRfcDateTime = pastDateTime.toISOString();
  return pastRfcDateTime;
}

// need to recalculate carousel2, 3 based on which thumnail was clicked
function thumbnailClickListener(carouselName, indexInCarousel, embedUrls, streamerIds, streamers) {
  window.initialClipPosition = window.currentClipPosition;
  window.currentClipPosition = {'game': carouselName, 'index': indexInCarousel};

  // if different thumbnail was clicked
  if (window.currentClipPosition.game !== window.initialClipPosition.game || window.currentClipPosition.index !== window.initialClipPosition.index) {
    window.activeCarousel = carouselName;
    window.carouselIndex = window.orderedCarousels.indexOf(carouselName);

    replaceCarouselItem(indexInCarousel, embedUrls, streamerIds, streamers);

    updateDonutPfp(streamerIds[indexInCarousel]);
    if (carouselName !== 'streamer-bar-carousel') {
      updateStreamerBarCarousel(streamerIds[indexInCarousel]);
    } else {
      const prevCarouselButton = document.getElementById('previous-carousel-button');
      prevCarouselButton.disabled = true;
      const nextCarouselButton = document.getElementById('next-carousel-button');
      nextCarouselButton.disabled = true;
    }

    // Show clipPlayer if it's hidden
    const clipPlayer = document.getElementById('clip-player-complex');
    const clipPlayerIsVisible = clipPlayer.style.display !== 'none';

    if (!clipPlayerIsVisible) {
      const disclosureButton = document.getElementById('disclosure-button');
      showClipPlayer(clipPlayer, disclosureButton);
    }
  }
}

export async function replaceCarouselItem(index, embedUrls, streamerIds, streamers) {
  const embedUrl = embedUrls[index];
  const { game } = window.currentClipPosition;
  const currentClip = window.clipsData[game][index];
  window.currentClip = currentClip;
  
  updateHistory(); // kind of just want to pass clipsData
  updateCarouselLabels(index);
  displayFollowStatus(streamers[index], window.activeCarousel, window.follows);
  //loadClipInteractions(currentClip); // Old method using localStorage - group upvote/downvote/net votes/favorite/comments into function like this (refactor) TODO
  displayNetVotes(currentClip.id);
  displayUserVoteOnClip(window.userId, currentClip.id);
  displayFavoriteStatusOfClip(window.userId, currentClip.id);
  displayComments(currentClip.id, window.userId);

  window.currentStreamerId = streamerIds[index];
  
  const iframeContainer = document.getElementById('iframe-container');
  const iframe = iframeContainer.querySelector('iframe');

  iframe.src = embedUrl + "&parent=localhost&autoplay=true";
  iframe.allowFullscreen = true;
  iframe.allow = "autoplay; fullscreen";

  iframeContainer.appendChild(iframe); // Makes first clip play with sound for some reason

  // Disable prevBtn/nextBtn if no clip to left (prevBtn disable condition) or right (nextBtn disable condition)
  const clipPlayerPreviousButton = document.getElementById('clip-player-prev-btn');
  clipPlayerPreviousButton.disabled = index === 0;

  const clipPlayerNextButton = document.getElementById('clip-player-next-btn');
  clipPlayerNextButton.disabled = index >= embedUrls.length - 1;

  // Disable appropriate carousel button if at topmost carousel or bottommost carousel
  const prevCarouselBtn = document.getElementById('previous-carousel-button');
  prevCarouselBtn.disabled = window.carouselIndex === 0;

  const nextCarouselBtn = document.getElementById('next-carousel-button');
  nextCarouselBtn.disabled = window.activeCarousel === window.orderedCarousels[window.orderedCarousels.length - 1];
}

export function highlightDiv(div) {
  const lastHighlightedDivId = window.highlightedDivId;
  if (lastHighlightedDivId) {
    const lastHighlightedDiv = document.getElementById(lastHighlightedDivId);
    lastHighlightedDiv.style.outline = '';
  }
  div.style.outline = '5px solid #6441A4'; // Width stays within margins
  div.style.cursor = 'default';
  window.highlightedDivId = div.id;
}

export async function getTopClips(clientId, authToken, carouselName, game, daysBack, carouselRowId, broadcasterName = false, gameId = false) {
    try {
      const response = await fetch(makeGetUrl(game, daysBack, broadcasterName, gameId), {
        method: 'GET',
        headers: {
          'Client-Id': clientId,
          'Authorization': 'Bearer ' + authToken
        }
      });
      const clipsData = await response.json();

      // this happens one time, not every time; add watch history constraint to prevent updates when coming back to top carousels from different carousels tab
      if (game === window.orderedCarousels[0] && window.watchHistory.length === 0) {
        window.currentClipPosition = {'game': carouselName, 'index': 0};
        window.activeCarousel = carouselName;

        // making clips data exist for updateHistory; moving makeClipsCarouselFromClipsData before this block breaks first thumbnail highlighting
        // refactor because duplicating making english clips
        const englishClips = clipsData.data.filter(clip => clip.language === 'en');
        window.clipsData[carouselName] = englishClips;

        const embedUrls = englishClips.map((datum) => datum.embed_url);
        const streamerIds = englishClips.map((datum) => datum.broadcaster_id);
        const streamers = englishClips.map((datum) => datum.broadcaster_name);

        // these need to come from englishClips
        replaceCarouselItem(0, embedUrls, streamerIds, streamers); // im updating history here, so i need clip data to exist
        updateDonutPfp(streamerIds[0]);
        updateStreamerBarCarousel(streamerIds[0]);
      }

      // This goes before next block in order to set window.clipsData[carouselName], which is used in updateHistory
      makeClipsCarouselFromClipsData(clipsData, carouselName, carouselRowId);
      
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }

export function makeClipsCarouselFromClipsData(clipsData, carouselName, carouselRowId = null, itemsPerView = 4) {
  if (!carouselRowId) {
    carouselRowId = `${makeCarouselId(carouselName)}-row`;
  }

  let carousel;
  const carouselItems = makeCarouselItems(carouselName, clipsData);
  
  carousel = new SmartCarousel(carouselRowId, itemsPerView);
  carousel.setItems(carouselItems);
  window.carouselInstances[carouselName] = carousel;
}

function makeCarouselItems(carouselName, clipsData) {
  const englishClips = clipsData.data.filter(clip => clip.language === 'en');
  window.clipsData[carouselName] = englishClips;

  let carouselItems = [];
  englishClips.forEach((clip, index) => {
    const { carouselItem, imageWrapper } = makeCarouselItem(carouselName, clip, index, englishClips);
    carouselItems.push(carouselItem);
    
    if (!window.firstThumbnail && window.currentClipPosition?.game === window.orderedCarousels[0]) {
      window.firstThumbnail = imageWrapper;
      highlightDiv(imageWrapper);
    }
  });

  return carouselItems;
}

function makeCarouselItem(carouselName, clip, index, englishClips) {
  console.assert(Array.isArray(englishClips), "englishClips is not an array");
  console.assert(
    typeof englishClips[0] === 'object' && englishClips[0] !== null && !Array.isArray(englishClips[0]),
    'englishClips is not an array of objects'
  );
  const embedUrls = englishClips.map((datum) => datum.embed_url);
  const titles = englishClips.map((datum) => datum.title);
  const viewCounts = englishClips.map((datum) => datum.view_count);
  const streamers = englishClips.map((datum) => datum.broadcaster_name);
  const streamerIds = englishClips.map((datum) => datum.broadcaster_id);
  const creationDateTimes = englishClips.map((datum) => datum.created_at);
  const durations = englishClips.map((datum) => datum.duration);

  // same for all clips in a getTopClps request -- requesting top clips in category
  let gameId;
  try {
    gameId = clipsData.data[0].game_id;
  } catch(error) {
    gameId = carouselName;
  }
  
  const carouselItem = document.createElement('div');
  carouselItem.id = carouselName + index;
  carouselItem.className = "carousel-element";

  const imageWrapper = document.createElement('div');
  imageWrapper.className = "img-wrapper";
  imageWrapper.id = carouselName + "img-wrapper" + index;
  imageWrapper.style.position = "relative";

  const image = document.createElement('img');
  image.src = clip.thumbnail_url + "?parent=localhost";
  image.classList.add('thumbnail');
  image.addEventListener('click', () => { thumbnailClickListener(carouselName, index, embedUrls, streamerIds, streamers) });
  image.addEventListener('click', () => { highlightDiv(imageWrapper) });
  window.thumbnailWrappers[`${carouselName}-${index}`] = imageWrapper;

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body';

  // Hold clipTitle and optionally redditIcon
  const titleWrapper = document.createElement('div');
  titleWrapper.style.display = 'flex';
  titleWrapper.style.gap = '6px';

  const clipTitle = document.createElement('p');
  clipTitle.className = 'clip-title';
  clipTitle.innerText = titles[index];
  clipTitle.style.color = "#FFFFFF";

  const viewCount = document.createElement('p');
  viewCount.className = 'view-count';
  viewCount.innerText = viewCounts[index].toLocaleString() + ' views';
  viewCount.style.color = "#FFFFFF";
  viewCount.style.position = 'absolute';
  viewCount.style.bottom = '0';
  viewCount.style.left = '0';

  const streamer = document.createElement('p');
  streamer.className = 'streamer';
  streamer.innerText = streamers[index];
  streamer.style.color = "#FFFFFF";

  const creationDate = document.createElement('p');
  creationDate.className = 'creation-date';
  creationDate.innerText = creationDateTimes[index];
  creationDate.style.color = "#FFFFFF";
  creationDate.style.position = 'absolute';
  creationDate.style.bottom = '0';
  creationDate.style.right = '0';

  const duration = document.createElement('p');
  duration.className = 'duration';
  duration.innerText = Math.round(durations[index]) + 's';
  duration.style.color = "#FFFFFF";
  duration.style.position = 'absolute';
  duration.style.top = '0';
  duration.style.left = '0';

  carouselItem.appendChild(imageWrapper);
  imageWrapper.appendChild(image);

  carouselItem.appendChild(cardBody);
  //cardBody.appendChild(clipTitle);
  titleWrapper.appendChild(clipTitle);
  cardBody.appendChild(titleWrapper);

  if (carouselName !== 'streamer-bar-carousel') {
    cardBody.appendChild(streamer);
    imageWrapper.appendChild(duration);
    imageWrapper.appendChild(viewCount);
    imageWrapper.appendChild(creationDate);   

    const redditIcon = document.createElement('img');
    redditIcon.src = 'https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png';       // alternative: https://static.lingoapp.com/avatar/s/75148/4D5390E4-1A1E-429A-8C24-73CF0F35EACD_180.png
    redditIcon.style.cursor = "pointer";
    redditIcon.title = "View on reddit";
    redditIcon.style.width = '16px';
    redditIcon.style.height = '16px';
    
    const redditPost = checkRedditPosts(embedUrls[index], window.redditPosts);
    if (redditPost) {
      titleWrapper.appendChild(redditIcon);
      redditIcon.addEventListener('click', () => window.open(redditPost.redditUrl, '_blank')) // Open reddit page in new tab
    }
  }

  return { carouselItem, imageWrapper };
}

async function updateCarouselLabels(clipIndex) {  
  const currentCarouselLabel = document.querySelector('.carousel-label');
  if (window.activeCarousel !== 'streamer-bar-carousel') {
    currentCarouselLabel.textContent = window.activeCarousel;
  } else {
    const clip = window.clipsData[window.activeCarousel][clipIndex];
    const game = await getGameFromId(clip.game_id, clientId, authToken);
    console.log('clip: ', clip);
    currentCarouselLabel.textContent = `${game}`;
  }
}

function updateHistory() {
  const { game, index: index1 } = window.currentClipPosition;
  const clip = window.clipsData[game][index1];
  const lastClip = window.watchHistory[window.watchHistory.length - 1];

  // for watchHistory = [], lastClip and lastClip?.id will be undefined
  if (clip.id !== lastClip?.id)
  {
    postClip(window.currentClip);
    postClipToHistory(window.userId, window.currentClip.id);
    window.watchHistory.push(clip);

    const carouselName = 'history-' + game;
    const { carouselItem: historyRow } = makeHistoryRow(carouselName, clip, 0, [clip]);
    
    const historyContainer = document.getElementById('history-items');
    historyContainer.prepend(historyRow);

    const previousCurrent = document.querySelector('.playlist-row.current');
    if (previousCurrent) {
      previousCurrent.classList.remove('current');
    }

    historyRow.classList.add('current');
  }

}

function makeHistoryRow(carouselName, clip, index, englishClips) {
  console.assert(Array.isArray(englishClips), "englishClips is not an array");
  console.assert(
    typeof englishClips[0] === 'object' && englishClips[0] !== null && !Array.isArray(englishClips[0]),
    'englishClips is not an array of objects'
  );

  const embedUrls = englishClips.map(d => d.embed_url);
  const titles = englishClips.map(d => d.title);
  const viewCounts = englishClips.map(d => d.view_count);
  const streamers = englishClips.map(d => d.broadcaster_name);
  const streamerIds = englishClips.map(d => d.broadcaster_id);
  const creationDateTimes = englishClips.map(d => d.created_at);
  const durations = englishClips.map(d => d.duration);

  // Create outer row container
  const row = document.createElement('div');
  row.className = "playlist-row";
  row.style.display = "flex";
  row.style.alignItems = "flex-start";
  row.style.marginBottom = "10px";

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
  thumb.addEventListener('click', () => { 
    thumbnailClickListener(carouselName, index, embedUrls, streamerIds, streamers);
    highlightDiv(thumbWrapper);
  });

  // Duration overlay
  const durationOverlay = document.createElement('span');
  durationOverlay.innerText = Math.round(durations[index]) + 's';
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
  infoCol.className = 'info-col'; // or add classList.add('info-col')
  infoCol.style.flex = "1";

  const titleEl = document.createElement('p');
  titleEl.innerText = titles[index];
  titleEl.style.margin = "0";
  titleEl.style.fontWeight = "bold";
  titleEl.style.color = "#FFFFFF";
  titleEl.style.cursor = "pointer";

  const streamerEl = document.createElement('p');
  streamerEl.innerText = streamers[index];
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

  return { carouselItem: row, imageWrapper: thumbWrapper };
}