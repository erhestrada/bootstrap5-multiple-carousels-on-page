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

  saveClipPositionData(indexInCarousel, embedUrls, streamerIds);
  replaceCarouselItem(indexInCarousel, embedUrls, streamerIds, streamers);

  let carousel2 = document.getElementById('carousel2');
  const carousel2Inner = document.getElementById('carousel2-inner');
  carousel2Inner.innerHTML = '';

  updateDonutPfp(streamerIds[indexInCarousel]);
  updateStreamerBarCarousel(streamerIds[indexInCarousel]);

  carousel2 = new bootstrap.Carousel(document.querySelector('#carousel2'));

  // Show clipPlayer if it's hidden
  const clipPlayer = document.getElementById('clip-player-complex');
  const clipPlayerIsVisible = clipPlayer.style.display !== 'none';

  if (!clipPlayerIsVisible) {
    const disclosureButton = document.getElementById('disclosure-button');
    showClipPlayer(clipPlayer, disclosureButton);
  }

}

export function saveClipPositionData(index, embedUrls, streamerIds) {
  localStorage.setItem('clipIndex', JSON.stringify(index));
  localStorage.setItem('clipEmbedUrls', JSON.stringify(embedUrls));
  localStorage.setItem('clipStreamerIds', JSON.stringify(streamerIds));
}

export function replaceCarouselItem(index, embedUrls, streamerIds, streamers) {
  const embedUrl = embedUrls[index];
  localStorage.setItem('currentClipStreamerId', streamerIds[index]);
  localStorage.setItem('currentClipStreamer', streamers[index]);
  console.log('current streamer: ', streamers[index]);
  localStorage.setItem("currentClipUrl", embedUrl + "&parent=localhost&autoplay=true");

  const currentClip = document.getElementById('current-clip');
  currentClip.remove();

  const carouselInner = document.querySelector('.carousel-inner');

  const newItem = document.createElement('div');
  newItem.className = 'carousel-item iframe-slide active';
  newItem.id = "current-clip";
  
  const flexContainer = document.createElement('div');
  flexContainer.className = 'd-flex justify-content-center align-items-center';
  
  const iframe = document.createElement('iframe');

  iframe.src = embedUrl + "&parent=localhost&autoplay=true";
  iframe.height = 360;
  iframe.width = 640;
  iframe.frameBorder = 0;
  iframe.allowFullscreen = true;

  flexContainer.appendChild(iframe);
  newItem.appendChild(flexContainer);
  carouselInner.appendChild(newItem);

  // Refresh the carousel to recognize the new item
  const carousel = new bootstrap.Carousel(document.querySelector('#carouselExampleControls'));
}

// use window instead of localStorage
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
      const embedUrls = clipsData.data.map((datum) => datum.embed_url);
      const streamerIds = clipsData.data.map((datum) => datum.broadcaster_id);
      const streamers = clipsData.data.map((datum) => datum.broadcaster_name);
      window.clipsData[carouselName] = clipsData;

      // this happens one time, not every time
      if (game === "Just Chatting") {
        window.currentClipPosition = {'game': carouselName, 'index': 0};
        window.activeCarousel = carouselName;
        saveClipPositionData(0, embedUrls, streamerIds);
        replaceCarouselItem(0, embedUrls, streamerIds, streamers);
        updateDonutPfp(streamerIds[0]);
        updateStreamerBarCarousel(streamerIds[0]);
      }
      
      makeClipsCarouselFromClipsData(clipsData, carouselName);
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }

export function makeClipsCarouselFromClipsData(clipsData, carouselName) {
  const carouselRowId = `${makeCarouselId(carouselName)}-row`;

  let carousel;
  const carouselItems = makeCarouselItems(carouselName, clipsData);
  
  carousel = new SmartCarousel(carouselRowId, 4);
  carousel.setItems(carouselItems);
}

function makeCarouselItems(carouselName, clipsData) {
  const englishClips = clipsData.data.filter(clip => clip.language === 'en');

  const embedUrls = englishClips.map((datum) => datum.embed_url);
  const thumbnailUrls = englishClips.map((datum) => datum.thumbnail_url);
  const titles = englishClips.map((datum) => datum.title);
  const languages = englishClips.map((datum) => datum.language);
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
  
  localStorage.setItem("embedUrls", JSON.stringify(embedUrls));
  embedUrls.forEach((element, index) => {localStorage.setItem(index, element)});

  let carouselItems = [];
  englishClips.forEach((clip, index) => {
    const carouselItem = document.createElement('div');
    carouselItem.id = carouselName + index;
    carouselItem.className = "carousel-element";

    const card = document.createElement('div');
    card.className = "card";
    //card.style.height = "300px";

    const imageWrapper = document.createElement('div');
    imageWrapper.className = "img-wrapper";
    imageWrapper.id = gameId + "img-wrapper" + index;
    imageWrapper.style.position = "relative";

    // formerly thumbnail
    const image = document.createElement('img');
    image.src = clip.thumbnail_url + "?parent=localhost";
    image.classList.add('thumbnail');
    //const indexInCarousel = makeIndexInCarousel(carouselName);
    //image.addEventListener('click', () => {thumbnailClickListener(carouselName, indexInCarousel, embedUrls, streamerIds, streamers)});
    //image.addEventListener('click', () => {highlightDiv(imageWrapper)});
    window.thumbnailWrappers[`${carouselName}-${index}`] = imageWrapper; // For highlighting appropriate thumbnail when clip player arrows are used

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

    //carouselItem.appendChild(card);
    carouselItem.appendChild(imageWrapper);
    imageWrapper.appendChild(image);
    carouselItem.appendChild(cardBody);
    cardBody.appendChild(clipTitle);
    cardBody.appendChild(streamer);
    imageWrapper.appendChild(duration);
    imageWrapper.appendChild(viewCount);
    imageWrapper.appendChild(creationDate); 

    carouselItems.push(carouselItem);
    
    // Just Chatting is always the top carousel
    if (!window.firstThumbnail && window.currentClipPosition?.game === 'Just Chatting') {
    window.firstThumbnail = imageWrapper;
    highlightDiv(imageWrapper);
    }
  });

  return carouselItems;
}
