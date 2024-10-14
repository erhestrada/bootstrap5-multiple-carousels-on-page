import { createInfiniteScroll } from './createInfiniteScroll.js';
import { getCarousel2Clips } from './getCarousel2Clips.js';
import { getCarousel3Clips } from './getCarousel3Clips.js';
import { getTopClips } from './getTopClips.js';

var clipIndex = 0;
 
 function replaceCarouselItem(increment) {
    console.log('DOM content loaded; localStorage.getItem(0)');
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
    //this clip is wrong when i do npm run dev the first time, it's right when i do it the second time
    console.log("first clip index: " + clipIndex + " first clip to play:" + iframe.src);
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

getTopClips(clientId, authToken, "Just Chatting", 1)
  .then((clipsData) => {
    replaceCarouselItem(0);
  })
  .catch((error) => {
    console.error(error);
});

getCarousel2Clips(clientId, authToken, "IRL", 1);
getCarousel3Clips(clientId, authToken, "World of Warcraft", 1);

document.querySelector('.carousel-control-next').addEventListener('click', () => replaceCarouselItem(1));
document.querySelector('.carousel-control-prev').addEventListener('click', () => replaceCarouselItem(-1));

window.addEventListener('scroll', createInfiniteScroll);
