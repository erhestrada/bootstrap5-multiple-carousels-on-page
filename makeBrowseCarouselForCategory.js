// basically a refactor of getTopClips
import { getTopClipsBrowse } from "./getTopClipsBrowse";
import { makeClipsCarouselSlide } from "./makeClipsCarouselNSlide";

// example box art url
// 'https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg

const boxArtWidth = 200;
const boxArtHeight = 200;

// thumbnailclicklistener in getTopClips is wrong for this
export async function makeBrowseCarouselForCategory(category, gameId, boxArtUrl) {
    const idFormattedCategory = category.replace(/ /g, '-').replace(/:/g, '').replace(/'/g, '');
    const carouselDiv = `
        <div id="${idFormattedCategory}-carousel" class="carousel slide">
        <div class="carousel-inner" id="${category}-carousel-inner">
            <img src=${boxArtUrl.replace("{width}", boxArtWidth).replace("{height}", boxArtHeight)} alt="${category}"/>
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
        `;

    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.remove();
    }
    document.querySelector('nav').insertAdjacentHTML('afterend', carouselDiv);
    await getTopClipsBrowse(clientId, authToken, category, category, 1, undefined, gameId);
    
    makeClipsCarouselSlide(`${idFormattedCategory}-carousel`);

}