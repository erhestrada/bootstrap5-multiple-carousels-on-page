// basically a refactor of getTopClips
import { getTopClips } from "./getTopClips";
import { makeClipsCarouselSlide } from "./makeClipsCarouselNSlide";

// example box art url
// 'https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg

const boxArtWidth = 200;
const boxArtHeight = 200;

// thumbnailclicklistener in getTopClips is wrong for this
export async function makeNewCarouselForCategory(category, gameId, boxArtUrl) {
    const idFormattedCategory = 'id-' + category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const carouselId = `${idFormattedCategory}-carousel`;

    const carouselDiv = `
        <div style="display: flex;">
        <img src=${boxArtUrl.replace("{width}", boxArtWidth).replace("{height}", boxArtHeight)} alt="${category}" class="boxart"/>

        <div id="${carouselId}" class="carousel slide carousel-no-overlap" style="flex: 1; min-width: 0;">
            <div class="carousel-inner thumbnails-carousel-inner" id="${category}-carousel-inner">
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#${carouselId}" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#${carouselId}" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        </div>
        `;

    const categoriesCarousels = document.getElementById('categories-carousels');
    categoriesCarousels.insertAdjacentHTML('beforeend', carouselDiv);

    const clipsData = await getTopClips(clientId, authToken, category, category, 1, undefined, gameId);

    const carouselElement = document.getElementById(`${idFormattedCategory}-carousel`);
    //if (carouselElement.id === 'id-rust-carousel') console.log(carouselElement.querySelector('.carousel-inner').children.length);

    // The first child in carousel-inner is always the boxArt (carouselDiv HTML above)
    if (clipsData.data.length === 0 || carouselElement.querySelector('.carousel-inner').children.length === 1) {
        const carouselElement = document.getElementById(`${idFormattedCategory}-carousel`);
        if (carouselElement) {
            carouselElement.remove();
            window.orderedCarousels = window.orderedCarousels.filter(name => name != category);
        }
    } else {
        makeClipsCarouselSlide(`${idFormattedCategory}-carousel`);
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