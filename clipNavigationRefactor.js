import { replaceCarouselItem } from './getTopClipsRefactor.js';
import { updateDonutPfp } from "./updateDonutPfp";
import { updateStreamerBarCarousel } from "./updateStreamerBarCarouselRefactor";
import { highlightDiv } from './getTopClipsRefactor.js';
import { elementInViewHorizontally, elementInViewVertically, scrollDownToThumbnail, scrollUpToThumbnail, slideCarousel } from './ensureThumbnailInViewRefactor.js';
import { makeCarouselId } from './makeCarouselForCategory.js';
import { carouselIsSliding } from './ensureThumbnailInViewRefactor.js';

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
        }

        // if streamer stays the same, don't have to update streamerBar e.g. clicked into streamerBarCarousel
        // updateStreamerBar()
        const streamerBarCarousel = document.getElementById('streamer-bar-carousel-container').querySelector('.carousel');
        streamerBarCarousel.innerHTML = '';
    
        updateDonutPfp(streamerIds[updatedClipsDataIndex]);
        //updateStreamerBarCarousel(streamerIds[updatedClipsDataIndex]);
    
        console.log(JSON.parse(JSON.stringify(window.currentClipPosition)));
    } else {

    }


}

// track active carousels
// scroll all the way to the left
export function changeCarousel(arrow) {
    if (isScrolling) return;
    isScrolling = true;

    let {game, index} = window.currentClipPosition;
    const carouselId = makeCarouselId(game);
    //slideCarousel(carouselId, 'reset');
    
    if (arrow === "next") {
        console.log('next carousel');
        if (window.carouselIndex < window.orderedCarousels.length) {
            window.carouselIndex++;
            window.activeCarousel = window.orderedCarousels[window.carouselIndex];
        }

    } else {
        console.log('previous carousel');
        if (window.carouselIndex > 0) {
            window.carouselIndex--;
            window.activeCarousel = window.orderedCarousels[window.carouselIndex];
        }
    }

    const activeCarouselInstance = window.carouselInstances[window.activeCarousel];
    let viewIndex;

    if (index < activeCarouselInstance.itemsInView.length)
        viewIndex = index; // Stay in the same column
    // if the previously active carousel had scrolled to the right
    else {  
        // stay in the same column by calculating the remainder
        viewIndex = index % activeCarouselInstance.itemsInView.length;
    }

    const activeElement = activeCarouselInstance.itemsInView[viewIndex];
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

    window.currentClipPosition = {'game': window.activeCarousel, 'index': index};

    // replace currently playing clip
    //const updatedIndex = window.currentClipPosition.index;
    const embedUrls = englishGameClipsData.map(d => d.embed_url);
    const streamerIds = englishGameClipsData.map(d => d.broadcaster_id);
    const streamers = englishGameClipsData.map(d => d.broadcaster_name);
    replaceCarouselItem(index, embedUrls, streamerIds, streamers);

    const streamerBarCarousel = document.getElementById('streamer-bar-carousel-container').querySelector('.carousel');
    streamerBarCarousel.innerHTML = '';
    updateDonutPfp(streamerIds[index]);
    //updateStreamerBarCarousel(streamerIds[updatedIndex]);

    setTimeout(() => {
        isScrolling = false;
    }, 400);

    //carousel2 = new bootstrap.Carousel(document.querySelector('#carousel2'));
}
