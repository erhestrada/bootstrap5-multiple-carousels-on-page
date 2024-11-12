import { updateStreamerBarCarouselFromDonut } from './updateStreamerBarCarouselFromDonut.js';
import { makeTopCategoriesCarousels } from './makeTopCategoriesCarousels.js';
import { saveClip } from './saveClip.js';
import { replaceCarouselItem } from './getTopClips.js';
import { updateDonutPfp } from "./updateDonutPfp";
import { updateStreamerBarCarousel } from "./updateStreamerBarCarousel";
import { followStreamer } from './followStreamer.js';

function x(arrow) {
    let index = JSON.parse(localStorage.getItem('clipIndex'));
    const embedUrls = JSON.parse(localStorage.getItem('clipEmbedUrls'));
    const streamerIds = JSON.parse(localStorage.getItem('clipStreamerIds'));
    const streamers = clipsData.data.map((datum) => datum.broadcaster_name);

    if (arrow === "next") {
        index++;
        localStorage.setItem('clipIndex', JSON.stringify(index));
    } else {
        if (index > 0) {
            index--;
            localStorage.setItem('clipIndex', JSON.stringify(index));
        }
    }

    replaceCarouselItem(index, embedUrls, streamerIds, streamers);

    // if streamer stays the same, don't have to update streamerBar e.g. clicked into streamerBarCarousel
    // updateStreamerBar()
    let carousel2 = document.getElementById('carousel2');
    const carousel2Inner = document.getElementById('carousel2-inner');
    carousel2Inner.innerHTML = '';
  
    updateDonutPfp(streamerIds[index]);
    updateStreamerBarCarousel(streamerIds[index]);
  
    carousel2 = new bootstrap.Carousel(document.querySelector('#carousel2'));

}

window.clipsData = {};
localStorage?.removeItem('highlightedDivId');

document.querySelector('#carouselExampleControls .carousel-control-next').addEventListener('click', () => x('next'));
document.querySelector('#carouselExampleControls .carousel-control-prev').addEventListener('click', () => x('prev'));

document.getElementById('like-button').addEventListener('click', () => saveClip("liked-clips"));
document.getElementById('dislike-button').addEventListener('click', () => saveClip("disliked-clips"));
document.getElementById('favorite-button').addEventListener('click', () => saveClip("favorited-clips"));
document.getElementById('follow-streamer-button').addEventListener('click', () => followStreamer(localStorage.getItem('currentClipStreamer'), localStorage.getItem('currentClipStreamerId')));

document.getElementById('donut-button-top').addEventListener('click', () => updateStreamerBarCarouselFromDonut(1));
document.getElementById('donut-button-right').addEventListener('click', () => updateStreamerBarCarouselFromDonut(7));
document.getElementById('donut-button-bottom').addEventListener('click', () => updateStreamerBarCarouselFromDonut(30));
// think ALL is the default if not start/end parameters
document.getElementById('donut-button-left').addEventListener('click', () => updateStreamerBarCarouselFromDonut(3650));

makeTopCategoriesCarousels();
