// basically a refactor of getTopClips
import { getTopClips } from "./getTopClips";
import { makeClipsCarouselSlide } from "./makeClipsCarouselNSlide";

// example box art url
// 'https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg

const boxArtWidth = 200;
const boxArtHeight = 200;

// thumbnailclicklistener in getTopClips is wrong for this
export async function makeCarouselForCategory(category, gameId, boxArtUrl) {
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


    //console.log(category);
    //console.log(`#${idFormattedCategory}-carousel`);

    document.body.insertAdjacentHTML('beforeend', carouselDiv);
    await getTopClips(clientId, authToken, category, category, 1, undefined, gameId);
    
    //const abc = document.querySelector(`#${idFormattedCategory}-carousel`);
    //console.log(abc);
    
    makeClipsCarouselSlide(`${idFormattedCategory}-carousel`);

}


// makeCarouselForCategory.js:35 Uncaught (in promise) SyntaxError: Failed to execute 'querySelector' on 'Document': '#EA Sports FC 25-carousel' is not a valid selector.