import { createInfiniteScroll } from './createInfiniteScroll.js';
import { getCarousel2Clips } from './getCarousel2Clips.js';
import { getCarousel3Clips } from './getCarousel3Clips.js';
import { getTopClips } from './getTopClips.js';
import { updateStreamerBarCarouselFromDonut } from './updateStreamerBarCarouselFromDonut.js';
import { makeTopCategoriesCarousels } from './makeTopCategoriesCarousels.js';

var clipIndex = 0;
 
// also need to replace pfp
// let me get the streamer/streamer name and console.log it
function replaceCarouselItem(increment) {
  const currentClip = document.getElementById("current-clip");
  currentClip.remove();

  const carouselInner = document.querySelector('.carousel-inner');
  
  const newItem = document.createElement('div');
  newItem.className = 'carousel-item iframe-slide active';
  newItem.id = "current-clip";
  
  const flexContainer = document.createElement('div');
  flexContainer.className = 'd-flex justify-content-center align-items-center';
  //flexContainer.style.height = '500px';
  
  const iframe = document.createElement('iframe');

  // handling the case of going left at the start -- better to just not do anything ? don't display prev-arrow on first clip?
  clipIndex = clipIndex + increment;
  if (clipIndex < 0) {
      clipIndex = 0;
  }

  iframe.src = localStorage.getItem(clipIndex) + "&parent=localhost&autoplay=true";

  iframe.height = '360';
  iframe.width = '640';
  iframe.frameBorder = '0';
  iframe.allowFullscreen = true;
  
  flexContainer.appendChild(iframe);
  newItem.appendChild(flexContainer);
  carouselInner.appendChild(newItem);

  // Refresh the carousel to recognize the new item
  const carousel = new bootstrap.Carousel(document.querySelector('#carouselExampleControls'));
}

getTopClips(clientId, authToken, "popular-clips", "Just Chatting", 1)
  .then((clipsData) => {
    // i need to set streamerId here, before a thumbnail has been clicked
    replaceCarouselItem(0);
  })
  .catch((error) => {
    console.error(error);
});


document.querySelector('.carousel-control-next').addEventListener('click', () => replaceCarouselItem(1));
document.querySelector('.carousel-control-prev').addEventListener('click', () => replaceCarouselItem(-1));

document.getElementById('donut-button-top').addEventListener('click', () => updateStreamerBarCarouselFromDonut(1));
document.getElementById('donut-button-right').addEventListener('click', () => updateStreamerBarCarouselFromDonut(7));
document.getElementById('donut-button-bottom').addEventListener('click', () => updateStreamerBarCarouselFromDonut(30));
document.getElementById('donut-button-left').addEventListener('click', () => updateStreamerBarCarouselFromDonut(365));

//window.addEventListener('scroll', createInfiniteScroll);
makeTopCategoriesCarousels();