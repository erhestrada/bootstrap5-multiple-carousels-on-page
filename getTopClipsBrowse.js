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
function thumbnailClickListener(index, embedUrls, streamerIds) {
  let carousel2 = document.getElementById('carousel2');
  const carousel2Inner = document.getElementById('carousel2-inner');
  carousel2Inner.innerHTML = '';

  carousel2 = new bootstrap.Carousel(document.querySelector('#carousel2'));
}


export function replaceCarouselItem(index, embedUrls, streamerIds) {
  const embedUrl = embedUrls[index];
  localStorage.setItem('currentClipStreamerId', streamerIds[index]);
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

function highlightDiv(div) {
  const lastHighlightedDivId = localStorage?.getItem('highlightedDivId') ?? false;

  console.log('divId:' + lastHighlightedDivId);
  console.log(lastHighlightedDivId===false);
  if (lastHighlightedDivId) {
    // it might no longer be on the page
    const lastHighlightedDiv = document?.getElementById(lastHighlightedDivId);
    if (lastHighlightedDiv) {
      lastHighlightedDiv.style.border = '';
    }
  }
  div.style.border = '5px solid #6441A4';
  localStorage.setItem('highlightedDivId', div.id);
}


export async function getTopClipsBrowse(clientId, authToken, carouselName, game, daysBack, broadcasterName = false, gameId = false) {
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

      
      makeClipsCarouselFromClipsData(clipsData, carouselName +"-carousel-inner", carouselName);
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }

function makeClipsCarouselFromClipsData(clipsData, carouselInnerId, carouselName) {
  const embedUrls = clipsData.data.map((datum) => datum.embed_url);
  const thumbnailUrls = clipsData.data.map((datum) => datum.thumbnail_url);
  const titles = clipsData.data.map((datum) => datum.title);
  const languages = clipsData.data.map((datum) => datum.language);
  const viewCounts = clipsData.data.map((datum) => datum.view_count);
  const streamers = clipsData.data.map((datum) => datum.broadcaster_name);
  const streamerIds = clipsData.data.map((datum) => datum.broadcaster_id);
  const creationDateTimes = clipsData.data.map((datum) => datum.created_at);
  const durations = clipsData.data.map((datum) => datum.duration);

  localStorage.setItem("embedUrls", JSON.stringify(embedUrls));
  embedUrls.forEach((element, index) => {localStorage.setItem(index, element)});
  // the first clip to play in the clipPlayer will be the first clip in TopClips - eventually better to do rows and columns to work with clipPlayer button click event
  localStorage.setItem("currentClipStreamerId", streamerIds[0]);

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
      card.style.height = "300px";

      const imageWrapper = document.createElement('div');
      imageWrapper.className = "img-wrapper";
      imageWrapper.id = "img-wrapper" + index;
      imageWrapper.style.position = "relative";

      // formerly thumbnail
      const image = document.createElement('img');
      image.src = url + "?parent=localhost";
      image.classList.add('thumbnail');
      // ignoring carousel2 (streamerbarcarousel) for now
      //image.addEventListener('click', () => {thumbnailClickListener(index, embedUrls, streamerIds)});
      image.addEventListener('click', () => {highlightDiv(imageWrapper)});
      image.addEventListener('click', () => {openPopUpPlayer(index, embedUrls, streamerIds)})

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

      popularClipsCarouselInner.appendChild(carouselItem);
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
      
    }

  });
}

function openPopUpPlayer(index, embedUrls, streamerIds) {
  //replaceCarouselItem(index, embedUrls, streamerIds);
  openPopUp();
  embedIframe(embedUrls[index]+"&parent=localhost&autoplay=true");
}

function openPopUp() {
  document.getElementById('popup').style.display = 'block';
}

export function closePopUp() {
  document.getElementById('popup').style.display = 'none';
}

// Close the popup when clicking outside of it
window.onclick = function(event) {
  const popup = document.getElementById('popup');
  if (event.target == popup) {
      closePopUp();
  }
}

function embedIframe(url) {
  const iframeContainer = document.getElementById('iframe-container');
  iframeContainer.innerHTML = ''; // Clear previous content

  const iframe = document.createElement('iframe');
  iframe.src = url; // Set the iframe source
  iframe.style.width = '640p'; // Set width
  iframe.style.height = '360'; // Set height
  iframe.frameBorder = 0;
  iframe.allowFullscreen = true;

  iframeContainer.appendChild(iframe); // Append the iframe to the container
}