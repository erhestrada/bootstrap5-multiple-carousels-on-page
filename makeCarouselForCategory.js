// basically a refactor of getTopClips
import { getTopClips } from "./getTopClips";

// thumbnailclicklistener in getTopClips is wrong for this
export function makeCarouselForCategory(category) {
    const carouselDiv = `
        <div id="${category}-carousel" class="carousel slide">
        <p>${category}</p>
        <div class="carousel-inner" id="${category}-carousel-inner">
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

    document.body.insertAdjacentHTML('beforeend', carouselDiv);
    getTopClips(clientId, authToken, category, category, 1);

}