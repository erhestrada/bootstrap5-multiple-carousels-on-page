// basically a refactor of getTopClips
import { getTopClips } from "./getTopClips";

// example box art url
// 'https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg

const boxArtWidth = 200;
const boxArtHeight = 200;

// thumbnailclicklistener in getTopClips is wrong for this
export async function makeNewCarouselForCategory(category, gameId, boxArtUrl, carouselsContainer) {
    const carouselId = makeCarouselId(category);
    const carouselRowId = `${carouselId}-row`;

    const carouselDiv = `
    <div class="carousel-row category-carousel-row" id=${carouselRowId}>
        <img src=${boxArtUrl.replace("{width}", boxArtWidth).replace("{height}", boxArtHeight)} alt="${category}" class="boxart"/>
        <button class="carousel-btn prevBtn"><i class="bi bi-chevron-left"></i></button>
        
        <div class="carousel-wrapper">
            <div class="carousel">
                <!-- Items will be dynamically generated -->
            </div>
        </div>
        
        <button class="carousel-btn nextBtn"><i class="bi bi-chevron-right"></i></button>
    </div>`;

    carouselsContainer.insertAdjacentHTML('beforeend', carouselDiv);

    const clipsData = await getTopClips(clientId, authToken, category, category, 1, carouselRowId, undefined, gameId);

    const carouselRow = document.getElementById(carouselRowId);
    const carouselElement = carouselRow.querySelector('.carousel');

    if (carouselElement.children.length === 0) {
        carouselRow.remove();
        window.orderedCarousels = window.orderedCarousels.filter(name => name != category);
    }

    return clipsData;

}

export function makeCarouselId(category) {
    const idFormattedCategory = 'id-' + category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const carouselId = `${idFormattedCategory}-carousel`;
    return carouselId;
}