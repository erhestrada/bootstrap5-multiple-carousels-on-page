// basically a refactor of getTopClips
import { getTopClips } from "./getTopClipsRefactor";
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
    <div class="carousel-row" id=${carouselId}-row>
        <img src=${boxArtUrl.replace("{width}", boxArtWidth).replace("{height}", boxArtHeight)} alt="${category}" class="boxart"/>
        <button class="carousel-btn prevBtn">‹</button>
        
        <div class="carousel-wrapper">
            <div class="carousel">
                <!-- Items will be dynamically generated -->
            </div>
        </div>
        
        <button class="carousel-btn nextBtn">›</button>
    </div>`;

    const categoriesCarousels = document.getElementById('categories-carousels');
    categoriesCarousels.insertAdjacentHTML('beforeend', carouselDiv);

    const clipsData = await getTopClips(clientId, authToken, category, category, 1, undefined, gameId);

    const carouselElement = document.getElementById(`${idFormattedCategory}-carousel`);
    //if (carouselElement.id === 'id-rust-carousel') console.log(carouselElement.querySelector('.carousel-inner').children.length);

    // The first child in carousel-inner is always the boxArt (carouselDiv HTML above)
    /*
    if (clipsData.data.length === 0 || carouselElement.querySelector('.carousel-inner').children.length === 1) {
        const carouselElement = document.getElementById(`${idFormattedCategory}-carousel`);
        if (carouselElement) {
            carouselElement.remove();
            window.orderedCarousels = window.orderedCarousels.filter(name => name != category);
        }
    }
    */
}

export function makeCarouselId(category) {
    const idFormattedCategory = 'id-' + category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const carouselId = `${idFormattedCategory}-carousel`;
    return carouselId;
}