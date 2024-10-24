// basically a refactor of getTopClips
import { getTopClips } from "./getTopClips";
import { makeClipsCarouselSlide } from "./makeClipsCarouselNSlide";

// example box art url
// 'https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg

const boxArtWidth = 200;
const boxArtHeight = 200;

// thumbnailclicklistener in getTopClips is wrong for this
export async function makeCarouselForCategory(category, gameId, boxArtUrl) {
    const carouselDiv = `
        <div id="${category}-carousel" class="carousel slide">
        <div class="carousel-inner" id="${category}-carousel-inner">
            <img src=${boxArtUrl.replace("{width}", boxArtWidth).replace("{height}", boxArtHeight)} alt="${category}boxart"/>
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
    await getTopClips(clientId, authToken, category, category, 1, undefined, gameId);
    
    const abc = document.querySelector(`#${category}-carousel`);
    console.log(abc);
    //const carousel = new bootstrap.Carousel(abc);
    //carousel.refresh(); // Refresh to recognize new items if needed
    
    makeClipsCarouselSlide(`${category}-carousel`);

}