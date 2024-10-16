import { getCarousel2Clips } from "./getCarousel2Clips";
import { updateDonutPfp } from "./updateDonutPfp";
import { updateStreamerBarCarousel } from "./updateStreamerBarCarousel";

const gameToIdConverter = {
    "IRL": "509672",
    "Just Chatting": "509658",
    "World of Warcraft": "18122",
    "League of Legends": "21779",
    "Grand Theft Auto V": "32982",
    "Valorant": "516575",
    "EA Sports FC 25": "2011938005",
    "Minecraft": "27471",
    "Throne and Liberty": "19801",
    "Fortnite": "33214",
    "Counter-Strike": "32399",
    "World of Warcraft": "18122",
    "Twitch All categories / multiple categories": "509658"
  }

function makeGetUrl(game, daysBack, broadcasterName = false) {
    const gameId = gameToIdConverter[game];
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
function thumbnailClickListener(index, embedUrls, streamerIds) {
  const embedUrl = embedUrls[index];

  const currentClip = document.getElementById('current-clip');
  currentClip.remove();

  const carouselInner = document.querySelector('.carousel-inner');

  const newItem = document.createElement('div');
  newItem.className = 'carousel-item iframe-slide active';
  newItem.id = "current-clip";
  
  const flexContainer = document.createElement('div');
  flexContainer.className = 'd-flex justify-content-center align-items-center';
  flexContainer.style.height = '500px';
  
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

  // -------------- updating carousel2 based on which thumbnail is clicked in carousel 1 ------------

  let carousel2 = document.getElementById('carousel2');
  const carousel2Inner = document.getElementById('carousel2-inner');
  carousel2Inner.innerHTML = '';

  updateDonutPfp(streamerIds[index]);
  updateStreamerBarCarousel(streamerIds[index]);

  carousel2 = new bootstrap.Carousel(document.querySelector('#carousel2'));
}


function highlightDiv(div) {
  const lastHighlightedDivId = localStorage?.getItem('highlightedDivId') ?? false;
  if (lastHighlightedDivId) {
    const lastHighlightedDiv = document.getElementById(lastHighlightedDivId);
    lastHighlightedDiv.style.border = '';
  }
  div.style.border = '1px solid #6441A4';
  localStorage.setItem('highlightedDivId', div.id);
}

export async function getTopClips(clientId, authToken, game, daysBack, broadcasterName = false) {
    try {
      const response = await fetch(makeGetUrl(game, daysBack, broadcasterName), {
        method: 'GET',
        headers: {
          'Client-Id': clientId,
          'Authorization': 'Bearer ' + authToken
        }
      });
      const clipsData = await response.json();

      const streamerIds = clipsData.data.map((datum) => datum.broadcaster_id);
      updateDonutPfp(streamerIds[0]);
      updateStreamerBarCarousel(streamerIds[0]);
      makeClipsCarouselFromClipsData(clipsData, "popular-clips-carousel-inner", 'popular-clips');
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }

function makeClipsCarouselFromClipsData(clipsData, carouselInnerId, carouselName) {
  const embedUrls = clipsData.data.map((datum) => datum.embed_url);
  localStorage.setItem("embedUrls", JSON.stringify(embedUrls));
  embedUrls.forEach((element, index) => {localStorage.setItem(index, element)});
  const thumbnailUrls = clipsData.data.map((datum) => datum.thumbnail_url);
  const titles = clipsData.data.map((datum) => datum.title);
  const languages = clipsData.data.map((datum) => datum.language);
  const viewCounts = clipsData.data.map((datum) => datum.view_count);
  const streamers = clipsData.data.map((datum) => datum.broadcaster_name);
  const streamerIds = clipsData.data.map((datum) => datum.broadcaster_id);
  const creationDateTimes = clipsData.data.map((datum) => datum.created_at);
  const durations = clipsData.data.map((datum) => datum.duration);

  const popularClipsCarouselInner = document.getElementById(carouselInnerId);

  thumbnailUrls.forEach((url, index) => {
    // checking for english should happen higher up - that's why i'm getting non english clips in my main carousel
    if(languages[index] === 'en') {


      const carouselItem = document.createElement('div');
      carouselItem.id = carouselName + index;
      carouselItem.className = "carousel-item"
      // Including this makes first thumbnail snap to top of container, included because bootstrap carousel supposedly needs a .active item, but everything's working fine without it
      /*
      if (index === 0) {
        carouselItem.classList.add('active');
      }*/

      const card = document.createElement('div');
      card.className = "card";

      const imageWrapper = document.createElement('div');
      imageWrapper.className = "img-wrapper";
      imageWrapper.id = "img-wrapper" + index;

      // formerly thumbnail
      const image = document.createElement('img');
      image.src = url + "&parent=localhost";
      image.classList.add('thumbnail');
      image.addEventListener('click', () => {thumbnailClickListener(index, embedUrls, streamerIds)});
      image.addEventListener('click', () => {highlightDiv(imageWrapper)});

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

      const streamer = document.createElement('p');
      streamer.innerText = streamers[index];
      streamer.style.color = "#FFFFFF";

      const creationDate = document.createElement('p');
      creationDate.innerText = creationDateTimes[index];
      creationDate.style.color = "#FFFFFF";

      const duration = document.createElement('p');
      duration.innerText = Math.round(durations[index]) + 's';
      duration.style.color = "#FFFFFF";

      popularClipsCarouselInner.appendChild(carouselItem);
      carouselItem.appendChild(card);
      
      card.appendChild(imageWrapper);
      imageWrapper.appendChild(image);
      card.appendChild(cardBody);
      //cardBody.appendChild(cardTitle);
      cardBody.appendChild(clipTitle);
      cardBody.appendChild(viewCount);
      cardBody.appendChild(streamer);
      cardBody.appendChild(creationDate);
      cardBody.appendChild(duration);


      /*
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
          <a href="#" class="btn btn-primary">Go somewhere</a>
        </div>
      */

      
    }

  });
}