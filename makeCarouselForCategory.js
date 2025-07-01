// basically a refactor of getTopClips
import { getTopClips } from "./getTopClips";
import { makeClipsCarouselSlide } from "./makeClipsCarouselNSlide";

// example box art url
// 'https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg

const boxArtWidth = 200;
const boxArtHeight = 200;

// thumbnailclicklistener in getTopClips is wrong for this
export async function makeCarouselForCategory(category, gameId, boxArtUrl) {
    const idFormattedCategory = 'id-' + category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const carouselId = `${idFormattedCategory}-carousel`;

    const carouselDiv = `
        <div id="${carouselId}" class="carousel slide">
        <div class="carousel-inner thumbnails-carousel-inner" id="${category}-carousel-inner">
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
        }
    } else {
        window.orderedCarousels.push(carouselId);
        makeClipsCarouselSlide(`${idFormattedCategory}-carousel`);
    }
}
