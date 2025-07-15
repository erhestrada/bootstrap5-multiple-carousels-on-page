import { replaceCarouselItem } from './getTopClips.js';
import { updateDonutPfp } from "./updateDonutPfp";
import { updateStreamerBarCarousel } from "./updateStreamerBarCarousel";
import { highlightDiv } from './getTopClips.js';
import { elementInViewHorizontally, elementInViewVertically, scrollDownToThumbnail, scrollUpToThumbnail, slideCarousel } from './ensureThumbnailInView.js';
import { makeCarouselId } from './makeCarouselForCategory.js';
import { carouselIsSliding } from './ensureThumbnailInView.js';

let isScrolling = false;

export function playAdjacentClip(arrow) {
    if (carouselIsSliding) return;
    // in getTopClips.js:
    // window.clipsData[carouselName] = clipsData;
    // window.currentClipPosition = {'game': carouselName, 'index': index};
    let {game, index} = window.currentClipPosition;
    console.log(JSON.parse(JSON.stringify(window.currentClipPosition)));

    const gameClipsData = clipsData[game].data;
    const englishGameClipsData = gameClipsData
        .map((datum, i) => ({ ...datum, clipsDataIndex: i }))
        .filter(datum => datum.language === 'en');

    console.log(englishGameClipsData);

    const embedUrls = englishGameClipsData.map(d => d.embed_url);
    const streamerIds = englishGameClipsData.map(d => d.broadcaster_id);
    const streamers = englishGameClipsData.map(d => d.broadcaster_name);
    const clipsDataIndices = englishGameClipsData.map(d => d.clipsDataIndex);

    if (arrow === "next") {
        window.currentClipPosition.index++;
        console.log('next clicked');

    } else {
        if (index > 0) {
            window.currentClipPosition.index--;
        }
    }

    const updatedIndex = window.currentClipPosition.index;

    // AND updatedIndex != startIndex
    if (updatedIndex in clipsDataIndices) {
        replaceCarouselItem(updatedIndex, embedUrls, streamerIds, streamers);
        const originalIndex = clipsDataIndices[updatedIndex];
        const thumbnailWrapper = window.thumbnailWrappers[`${game}-${originalIndex}`];
        highlightDiv(thumbnailWrapper);

        const thumbnailInViewHorizontally = elementInViewHorizontally(thumbnailWrapper);
        if (thumbnailInViewHorizontally != 'visible') {
            const carouselId = makeCarouselId(game);
            slideCarousel(carouselId, thumbnailInViewHorizontally);
        }

        // if streamer stays the same, don't have to update streamerBar e.g. clicked into streamerBarCarousel
        // updateStreamerBar()
        const carousel2Inner = document.getElementById('carousel2-inner');
        carousel2Inner.innerHTML = '';
    
        updateDonutPfp(streamerIds[updatedIndex]);
        updateStreamerBarCarousel(streamerIds[updatedIndex]);
    
        //carousel2 = new bootstrap.Carousel(document.querySelector('#carousel2'));
        console.log(JSON.parse(JSON.stringify(window.currentClipPosition)));
    } else {

    }


}

// track active carousels
export function changeCarousel(arrow) {
    if (isScrolling) return;
    isScrolling = true;
    
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

    // highlight the correct thumbnails
    const gameClipsData = clipsData[window.activeCarousel].data;
    const englishGameClipsData = gameClipsData
        .map((datum, i) => ({ ...datum, originalIndex: i }))
        .filter(datum => datum.language === 'en');
    const originalIndices = englishGameClipsData.map(d => d.originalIndex);
    const originalIndex = originalIndices[0];
    const thumbnailWrapper = window.thumbnailWrappers[`${window.activeCarousel}-${originalIndex}`];
    highlightDiv(thumbnailWrapper);

    const thumbnailInViewVertically = elementInViewVertically(thumbnailWrapper);

    if (thumbnailInViewVertically != 'visible') {
        if (thumbnailInViewVertically === 'below') {
            scrollDownToThumbnail();
        } else if (thumbnailInViewVertically === 'above') {
            scrollUpToThumbnail();
        }
    }

    window.currentClipPosition = {'game': window.activeCarousel, 'index': 0};

    // replace currently playing clip
    const updatedIndex = window.currentClipPosition.index;
    const embedUrls = englishGameClipsData.map(d => d.embed_url);
    const streamerIds = englishGameClipsData.map(d => d.broadcaster_id);
    const streamers = englishGameClipsData.map(d => d.broadcaster_name);
    replaceCarouselItem(updatedIndex, embedUrls, streamerIds, streamers);

    const carousel2Inner = document.getElementById('carousel2-inner');
    carousel2Inner.innerHTML = '';
  
    updateDonutPfp(streamerIds[updatedIndex]);
    updateStreamerBarCarousel(streamerIds[updatedIndex]);

    setTimeout(() => {
        isScrolling = false;
    }, 400);

    //carousel2 = new bootstrap.Carousel(document.querySelector('#carousel2'));
}
