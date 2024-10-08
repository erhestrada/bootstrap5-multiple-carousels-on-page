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

function makeGetUrl(game, daysBack) {
    const gameId = gameToIdConverter[game];
    const currentDateTime = getCurrentDateTime();
    const pastDateTime = getPastDateTime(daysBack);
    return "https://api.twitch.tv/helix/clips?game_id=" + gameId + "&started_at=" + pastDateTime + "&ended_at=" + currentDateTime + "&is_featured=false" + "&first=100";
  
  }
  
  function getCurrentDateTime() {
    const dateTime = new Date();
    const rfcDateTime = dateTime.toISOString();
    return rfcDateTime;
  }
  
  function getPastDateTime(daysBack) {
    const hoursBack = daysBack * 24;
    const dateTime = new Date();
    const pastDateTime = new Date(dateTime.getTime() - hoursBack * 60 * 60 * 1000);
    const pastRfcDateTime = pastDateTime.toISOString();
    return pastRfcDateTime;
  }

export async function getTopClips(clientId, authToken, game, daysBack) {
    try {
      const response = await fetch(makeGetUrl(game, daysBack), {
        method: 'GET',
        headers: {
          'Client-Id': clientId,
          'Authorization': 'Bearer ' + authToken
        }
      });
      const clipsData = await response.json();
      const embedUrls = clipsData.data.map((datum) => datum.embed_url);
      localStorage.setItem("embedUrls", JSON.stringify(embedUrls));
      embedUrls.forEach((element, index) => {localStorage.setItem(index, element)});
      const thumbnailUrls = clipsData.data.map((datum) => datum.thumbnail_url);
      const titles = clipsData.data.map((datum) => datum.title);
      const languages = clipsData.data.map((datum) => datum.language);
      const viewCounts = clipsData.data.map((datum) => datum.view_count);
      const streamers = clipsData.data.map((datum) => datum.broadcaster_name);
      const creationDateTimes = clipsData.data.map((datum) => datum.created_at);
      const durations = clipsData.data.map((datum) => datum.duration);

      const popularClipsCarouselInner = document.getElementById('popular-clips-carousel-inner');

      thumbnailUrls.forEach((url, index) => {
        // checking for english should happen higher up - that's why i'm getting non english clips in my main carousel
        if(languages[index] === 'en') {
          /*

              <div class="carousel-inner">
        <div class="carousel-item active">
          <div class="card">
            <div class="img-wrapper">
              <img src="thumbnailExample.png" alt="...">
            </div>
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        */

          const carouselItem = document.createElement('div');
          carouselItem.className = "carousel-item"
          if (index === 0) {
            carouselItem.classList.add('active');
          }

          const card = document.createElement('div');
          card.className = "card";

          const imageWrapper = document.createElement('div');
          imageWrapper.className = "img-wrapper";

          // formerly thumbnail
          const image = document.createElement('img');
          image.src = url + "&parent=localhost";
          image.classList.add('thumbnail');
          image.addEventListener('click', () => {thumbnailClickListener(index, embedUrls)});

          const cardBody = document.createElement('div');
          cardBody.className = 'card-body';

          popularClipsCarouselInner.appendChild(carouselItem);
          carouselItem.appendChild(card);
          card.appendChild(imageWrapper);
          imageWrapper.appendChild(image);
          card.appendChild(cardBody);


            /*
            const thumbnail = document.createElement('img');
            thumbnail.src = url + "&parent=localhost";
            thumbnail.height = 360;
            thumbnail.width = 640;
            thumbnail.frameBorder = 0;
            thumbnail.allow = 'autoplay *; encrypted-media *;';
            thumbnail.loading = 'lazy';
            thumbnail.allowFullscreen = true;
            thumbnail.className = "thumbnail";
            thumbnail.addEventListener('click', () => {thumbnailClickListener(index, embedUrls)});
            */
    
            /*
            const titleElement = document.createElement('p');
            titleElement.textContent = titles[index];

            const streamerElement = document.createElement('p');
            streamerElement.textContent = streamers[index];

            const viewCountElement = document.createElement('p');
            viewCountElement.textContent = viewCounts[index].toLocaleString() + " views";

            const durationElement = document.createElement('p');
            durationElement.textContent = Math.round(durations[index]) + 's';

            const creationDateTimeElement = document.createElement('p');
            creationDateTimeElement.textContent = creationDateTimes[index];
            */


          
        }

      });
  
      return clipsData;
    } catch (error) {
      console.error(error);
    }
  }

  /*
   <div id="carouselExample" class="carousel slide">
      <h1>Carousel 1</h1>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <div class="card">
            <div class="img-wrapper">
              <img src="thumbnailExample.png" alt="...">
            </div>
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="card">
            <div class="img-wrapper">
              <img src="thumbnailExample2.png" alt="...">
            </div>
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="card">
            <div class="img-wrapper">
              <img src="thumbnailExample3.png" alt="...">
            </div>
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="card">
            <div class="img-wrapper">
              <img src="thumbnailExample4.png" alt="...">
            </div>
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="card">
            <div class="img-wrapper">
              <img src="thumbnailExample5.png" alt="...">
            </div>
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="card">
            <div class="img-wrapper">
              <img src="thumbnailExample6.png" alt="...">
            </div>
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="card">
            <div class="img-wrapper">
              <img src="thumbnailExample7.png" alt="...">
            </div>
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="card">
            <div class="img-wrapper">
              <img src="thumbnailExample8.png" alt="...">
            </div>
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="card">
            <div class="img-wrapper">
              <img src="thumbnailExample9.png" alt="...">
            </div>
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
        <div class="carousel-item">
          <div class="card">
            <div class="img-wrapper">
              <img src="thumbnailExample10.png" alt="...">
            </div>
            <div class="card-body">
              <h5 class="card-title">Card title</h5>
              <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  */