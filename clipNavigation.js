import { replaceCarouselItem } from './getTopClips.js';
import { updateDonutPfp } from "./updateDonutPfp";
import { updateStreamerBarCarousel } from "./updateStreamerBarCarousel";
import { highlightDiv } from './getTopClips.js';
import { elementInViewHorizontally } from './ensureThumbnailInView.js';
import { elementInViewVertically } from './ensureThumbnailInView.js';
import { scrollDownToThumbnail } from './ensureThumbnailInView.js';
import { slideCarousel } from './ensureThumbnailInView.js';
import { makeCarouselId } from './makeCarouselForCategory.js';

// (how do i handle the case if arrow === next and currentClipPosition is at end of carousel?) <===============

export function playAdjacentClip(arrow) {
    // in getTopClips.js:
    // window.clipsData[carouselName] = clipsData;
    // window.currentClipPosition = {'game': carouselName, 'index': index};
    let {game, index} = window.currentClipPosition;
    console.log(JSON.parse(JSON.stringify(window.currentClipPosition)));

    const gameClipsData = clipsData[game].data;
    const englishGameClipsData = gameClipsData
        .map((datum, i) => ({ ...datum, originalIndex: i }))
        .filter(datum => datum.language === 'en');

    console.log(englishGameClipsData);

    const embedUrls = englishGameClipsData.map(d => d.embed_url);
    const streamerIds = englishGameClipsData.map(d => d.broadcaster_id);
    const streamers = englishGameClipsData.map(d => d.broadcaster_name);
    const originalIndices = englishGameClipsData.map(d => d.originalIndex);

    if (arrow === "next") {
        window.currentClipPosition.index++;
        console.log('next clicked');

    } else {
        if (index > 0) {
            window.currentClipPosition.index--;
        }
    }

    const updatedIndex = window.currentClipPosition.index;

    replaceCarouselItem(updatedIndex, embedUrls, streamerIds, streamers);
    const originalIndex = originalIndices[updatedIndex];
    const thumbnailWrapper = window.thumbnailWrappers[`${game}-${originalIndex}`];
    highlightDiv(thumbnailWrapper);

    const thumbnailInView = elementInViewHorizontally(thumbnailWrapper);
    if (thumbnailInView != 'visible') {
        const carouselId = makeCarouselId(game);
        slideCarousel(carouselId, thumbnailInView);
    }


    // if streamer stays the same, don't have to update streamerBar e.g. clicked into streamerBarCarousel
    // updateStreamerBar()
    const carousel2Inner = document.getElementById('carousel2-inner');
    carousel2Inner.innerHTML = '';
  
    updateDonutPfp(streamerIds[updatedIndex]);
    updateStreamerBarCarousel(streamerIds[updatedIndex]);
  
    carousel2 = new bootstrap.Carousel(document.querySelector('#carousel2'));
    console.log(JSON.parse(JSON.stringify(window.currentClipPosition)));
}

// track active carousels
export function changeCarousel(arrow) {
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
  
    carousel2 = new bootstrap.Carousel(document.querySelector('#carousel2'));
}
