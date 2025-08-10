import { updateDonutPfp } from "./updateDonutPfp";
import { updateStreamerBarCarousel } from "./updateStreamerBarCarouselRefactor";
import { showClipPlayer } from "./toggleClipPlayer";
import { SmartCarousel } from "./smartCarousel";
import { makeCarouselId } from "./makeNewCarouselForCategory";

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
  window.currentClipPosition = {'game': carouselName, 'index': indexInCarousel};
  window.activeCarousel = carouselName;
  window.carouselIndex = window.orderedCarousels.indexOf(carouselName);

  replaceCarouselItem(indexInCarousel, embedUrls, streamerIds, streamers);

  updateDonutPfp(streamerIds[indexInCarousel]);
  updateStreamerBarCarousel(streamerIds[indexInCarousel]);

  // Show clipPlayer if it's hidden
  const clipPlayer = document.getElementById('clip-player-complex');
  const clipPlayerIsVisible = clipPlayer.style.display !== 'none';

  if (!clipPlayerIsVisible) {
    const disclosureButton = document.getElementById('disclosure-button');
    showClipPlayer(clipPlayer, disclosureButton);
  }

}

export function replaceCarouselItem(index, embedUrls, streamerIds, streamers) {
  const embedUrl = embedUrls[index];
  console.log('current streamer: ', streamers[index]);
  updateHistory(); // kind of just want to pass clipsData
  
  const iframeContainer = document.getElementById('iframe-container');
  const iframe = iframeContainer.querySelector('iframe');

  iframe.src = embedUrl + "&parent=localhost&autoplay=true";
  iframe.allowFullscreen = true;
  iframe.allow = "autoplay; fullscreen"; // autoaudio only working on first clip; removing this will make audio mute

  iframeContainer.appendChild(iframe);
}

export function highlightDiv(div) {
  const lastHighlightedDivId = window.highlightedDivId;
  if (lastHighlightedDivId) {
    const lastHighlightedDiv = document.getElementById(lastHighlightedDivId);
    lastHighlightedDiv.style.outline = '';
  }
  div.style.outline = '5px solid #6441A4'; // Width stays within margins
  window.highlightedDivId = div.id;
}

export async function getTopClips(clientId, authToken, carouselName, game, daysBack, broadcasterName = false, gameId = false) {
    try {
      const response = await fetch(makeGetUrl(game, daysBack, broadcasterName, gameId), {
        method: 'GET',
        headers: {
          'Client-Id': clientId,
          'Authorization': 'Bearer ' + authToken
        }
      });
      const clipsData = await response.json();
      //const embedUrls = clipsData.data.map((datum) => datum.embed_url);
      //const streamerIds = clipsData.data.map((datum) => datum.broadcaster_id);
      //const streamers = clipsData.data.map((datum) => datum.broadcaster_name);

      // this happens one time, not every time
      if (game === window.orderedCarousels[0]) {
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
        updateCarouselLabels();
      }

      // This goes before next block in order to set window.clipsData[carouselName], which is used in updateHistory
      makeClipsCarouselFromClipsData(clipsData, carouselName);
      
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }

export function makeClipsCarouselFromClipsData(clipsData, carouselName, itemsPerView = 4) {
  const carouselRowId = `${makeCarouselId(carouselName)}-row`;

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

  carouselItem.appendChild(imageWrapper);
  imageWrapper.appendChild(image);
  carouselItem.appendChild(cardBody);
  cardBody.appendChild(clipTitle);
  cardBody.appendChild(streamer);
  imageWrapper.appendChild(duration);
  imageWrapper.appendChild(viewCount);
  imageWrapper.appendChild(creationDate);

  return { carouselItem, imageWrapper };
}

function updateCarouselLabels() {
  const currentCarouselLabels = document.querySelectorAll('.carousel-label');
  currentCarouselLabels.forEach(label => {
      label.textContent = window.activeCarousel;
  });
}

function updateHistory() {
  const { game, index: index1 } = window.currentClipPosition;
  const clip = window.clipsData[game][index1];

  const carouselName = 'history-' + game;
  const { carouselItem: clipItem } = makeHistoryRow(carouselName, clip, 0, [clip]);

  window.watchHistory.push(clip);
  
  const historyContainer = document.getElementById('history-items');

  historyContainer.prepend(clipItem);
}

function makeHistoryRow(carouselName, clip, index, englishClips) {
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

  carouselItem.appendChild(imageWrapper);
  imageWrapper.appendChild(image);
  carouselItem.appendChild(cardBody);
  cardBody.appendChild(clipTitle);
  cardBody.appendChild(streamer);
  imageWrapper.appendChild(duration);
  imageWrapper.appendChild(viewCount);
  imageWrapper.appendChild(creationDate);

  return { carouselItem, imageWrapper };
}
