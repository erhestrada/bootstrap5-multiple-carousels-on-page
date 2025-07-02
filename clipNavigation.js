import { replaceCarouselItem } from './getTopClips.js';
import { updateDonutPfp } from "./updateDonutPfp";
import { updateStreamerBarCarousel } from "./updateStreamerBarCarousel";
import { highlightDiv } from './getTopClips.js';

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

    // if streamer stays the same, don't have to update streamerBar e.g. clicked into streamerBarCarousel
    // updateStreamerBar()
    let carousel2 = document.getElementById('carousel2');
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
        //window.currentClipPosition.index++;
        //console.log('next clicked');

    } else {
        if (index > 0) {
            //window.currentClipPosition.index--;
        }
    }

}
