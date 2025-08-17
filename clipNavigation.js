import { replaceCarouselItem } from './getTopClips.js';
import { updateDonutPfp } from "./updateDonutPfp";
import { updateStreamerBarCarousel } from "./updateStreamerBarCarousel";
import { highlightDiv } from './getTopClips.js';
import { elementInViewHorizontally, elementInViewVertically, scrollDownToThumbnail, scrollUpToThumbnail, slideCarousel } from './ensureThumbnailInView.js';
import { makeCarouselId } from './makeNewCarouselForCategory.js';
import { carouselIsSliding } from './ensureThumbnailInView.js';

let isScrolling = false;

export function playAdjacentClip(arrow) {
    if (carouselIsSliding) return;
    // in getTopClips.js:
    // window.clipsData[carouselName] = clipsData;
    // window.currentClipPosition = {'game': carouselName, 'index': index};
    let {game, index: initialIndexInCarousel} = window.currentClipPosition;
    console.log(JSON.parse(JSON.stringify(window.currentClipPosition)));

    const englishGameClipsData = window.clipsData[game];

    const embedUrls = englishGameClipsData.map(d => d.embed_url);
    const streamerIds = englishGameClipsData.map(d => d.broadcaster_id);
    const streamers = englishGameClipsData.map(d => d.broadcaster_name);

    const activeCarouselInstance = window.carouselInstances[window.activeCarousel];
    const numberOfThumbnails = activeCarouselInstance.totalItems;

    let updatedClipsDataIndex;

    if (arrow === "next") {
        updatedClipsDataIndex = initialIndexInCarousel + 1;
        if (updatedClipsDataIndex >= numberOfThumbnails) return;
    } else if (arrow === "prev") {
        if (initialIndexInCarousel > 0) {
            updatedClipsDataIndex = initialIndexInCarousel - 1;
            //window.currentClipPosition.index--;
        } else {
            return;
        }
    }

    if (updatedClipsDataIndex !== initialIndexInCarousel) {
        window.currentClipPosition.index = updatedClipsDataIndex;

        replaceCarouselItem(updatedClipsDataIndex, embedUrls, streamerIds, streamers);
        const thumbnailWrapper = window.thumbnailWrappers[`${game}-${updatedClipsDataIndex}`];
        console.log(game);
        console.log(updatedClipsDataIndex);
        console.log(thumbnailWrapper);
        highlightDiv(thumbnailWrapper);

        const thumbnailInViewHorizontally = elementInViewHorizontally(thumbnailWrapper);
        if (thumbnailInViewHorizontally != 'visible') {
            const carouselId = makeCarouselId(game);
            slideCarousel(game, thumbnailInViewHorizontally);

            if (thumbnailInViewHorizontally === 'right') {
                activeCarouselInstance.viewPosition++;
            } else if (thumbnailInViewHorizontally === 'left') {
                activeCarouselInstance.viewPosition--;
            }
        }

        // Can make this condition more general - whenever streamer stays the same
        if (window.activeCarousel !== "streamer-bar-carousel") {    
            updateDonutPfp(streamerIds[updatedClipsDataIndex]);
            updateStreamerBarCarousel(streamerIds[updatedClipsDataIndex]);
        }

    }
}

export function changeCarousel(arrow) {
    if (isScrolling) return;
    isScrolling = true;

    let {game, index} = window.currentClipPosition;
    const carouselId = makeCarouselId(game);
    //slideCarousel(carouselId, 'reset');

    const offset =  carouselInstances[game].viewOffset;
    
    let carouselChanged = false;
    if (arrow === "next") {
        if (window.carouselIndex < window.orderedCarousels.length - 1) {
            window.carouselIndex++;
            window.activeCarousel = window.orderedCarousels[window.carouselIndex];
            carouselChanged = true;
        }

    } else {
        if (window.carouselIndex > 0) {
            window.carouselIndex--;
            window.activeCarousel = window.orderedCarousels[window.carouselIndex];
            carouselChanged = true;
        }
    }

    if (carouselChanged) {
        const activeCarouselInstance = window.carouselInstances[window.activeCarousel];
        let thumbnailIndexInView;

        if (index < activeCarouselInstance.itemsInView.length)
            thumbnailIndexInView = index; // Stay in the same column
        // if the previously active carousel had scrolled to the right
        else {  
            // stay in the same column by calculating the remainder
            thumbnailIndexInView = index - offset;
        }

        //const thumbnailIndexInCarousel = activeCarouselInstance.viewPosition * activeCarouselInstance.itemsPerView + thumbnailIndexInView;
        const thumbnailIndexInCarousel = activeCarouselInstance.viewOffset + thumbnailIndexInView;

        const activeElement = activeCarouselInstance.itemsInView[thumbnailIndexInView];
        console.log('LK;ASDJK;LFDASKL;J', activeElement);

        // highlight the correct thumbnails
        const englishGameClipsData = window.clipsData[window.activeCarousel];
        //const thumbnailWrapper = window.thumbnailWrappers[`${window.activeCarousel}-${index}`];
        const thumbnailWrapper = activeElement.querySelector('.img-wrapper');
        highlightDiv(thumbnailWrapper);

        const thumbnailInViewVertically = elementInViewVertically(thumbnailWrapper);

        if (thumbnailInViewVertically != 'visible') {
            if (thumbnailInViewVertically === 'below') {
                scrollDownToThumbnail();
            } else if (thumbnailInViewVertically === 'above') {
                scrollUpToThumbnail();
            }
        }

        window.currentClipPosition = {'game': window.activeCarousel, 'index': thumbnailIndexInCarousel};

        // replace currently playing clip
        //const updatedIndex = window.currentClipPosition.index;
        const embedUrls = englishGameClipsData.map(d => d.embed_url);
        const streamerIds = englishGameClipsData.map(d => d.broadcaster_id);
        const streamers = englishGameClipsData.map(d => d.broadcaster_name);
        replaceCarouselItem(thumbnailIndexInCarousel, embedUrls, streamerIds, streamers);

        const streamerBarCarousel = document.getElementById('streamer-bar-carousel-container').querySelector('.carousel');
        streamerBarCarousel.innerHTML = '';
        updateDonutPfp(streamerIds[thumbnailIndexInCarousel]);
        updateStreamerBarCarousel(streamerIds[thumbnailIndexInCarousel]);
        updateCarouselLabels();

        setTimeout(() => {
            isScrolling = false;
        }, 400);
    } else {
        // to avoid returning immediately at the beginning of the function
        isScrolling = false;
    }
}

function updateCarouselLabels() {
  const currentCarouselLabels = document.querySelectorAll('.carousel-label');
  currentCarouselLabels.forEach(label => {
      label.textContent = window.activeCarousel;
  });
}