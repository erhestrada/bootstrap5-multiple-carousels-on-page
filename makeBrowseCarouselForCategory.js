import { getTopClipsBrowse } from "./getTopClipsBrowse";
import { getTopClips } from "./getTopClips";
import { makeClipsCarouselSlide } from "./makeClipsCarouselNSlide";

const boxArtWidth = 200;
const boxArtHeight = 200;

export async function makeBrowseCarouselForCategory(category, gameId, boxArtUrl) {
    const carouselDiv = `
        <div id="browse-carousel" class="carousel slide">
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

    const carousel = document.getElementById("browse-carousel");
    if (carousel) {
        carousel.remove();
    }
    document.querySelector('nav').insertAdjacentHTML('afterend', carouselDiv);
    await getTopClipsBrowse(clientId, authToken, category, category, 1, undefined, gameId);
    //await getTopClips(clientId, authToken, category, category, 1, undefined, gameId);
    
    makeClipsCarouselSlide("browse-carousel");
}