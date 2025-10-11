import { getStreamerClips } from "./updateStreamerBarCarousel";
import { makeClipsCarouselFromClipsData } from "./getTopClips";

// example box art url
// 'https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg

const boxArtWidth = 200;
const boxArtHeight = 200;

export async function makeNewCarouselForStreamer(streamer, twitchId, profilePictureUrl, daysBack = 7) {
    //profilePictureUrl = 'https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg'; // TODO: pass in actual profile picture url
    const carouselId = makeCarouselId(streamer);
    
    const carouselDiv = `
    <div class="carousel-row category-carousel-row" id=${carouselId}-row>
        <img src=${profilePictureUrl.replace("{width}", boxArtWidth).replace("{height}", boxArtHeight)} alt="${streamer}" class="boxart"/>
        <button class="carousel-btn prevBtn"><i class="bi bi-chevron-left"></i></button>
        
        <div class="carousel-wrapper">
            <div class="carousel">
                <!-- Items will be dynamically generated -->
            </div>
        </div>
        
        <button class="carousel-btn nextBtn"><i class="bi bi-chevron-right"></i></button>
    </div>`;

    const categoriesCarousels = document.getElementById('categories-carousels');
    categoriesCarousels.insertAdjacentHTML('beforeend', carouselDiv);

    const clipsData = await getStreamerClips(twitchId, daysBack);
    makeClipsCarouselFromClipsData(clipsData, streamer); // Must match carouselName from makeClipsCarouselFromClipsData in getTopClips.js: const carouselRowId = `${makeCarouselId(carouselName)}-row`;

    const carouselRow = document.getElementById(`${carouselId}-row`);
    const carouselElement = carouselRow.querySelector('.carousel');

    if (carouselElement.children.length === 0) {
        carouselRow.remove();
        window.orderedCarousels = window.orderedCarousels.filter(name => name != streamer);
    }

}

export function makeCarouselId(category) {
    const idFormattedCategory = 'id-' + category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const carouselId = `${idFormattedCategory}-carousel`;
    return carouselId;
}
