import { makeCarouselCards } from './makeCarouselCards.js';

let carouselNumber = 5;

const carouselButtonsHtml = `<button class="carousel-control-prev" type="button">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>`;

export function createInfiniteScroll() {

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        addCarousel();
    }
}

function addCarousel() {
    const newCarousel = document.createElement('div');
    newCarousel.id = "carousel" + carouselNumber;
    newCarousel.className = "carousel slide";

    const newCarouselInner = document.createElement('div');
    newCarouselInner.id = newCarousel.id + "-inner";
    newCarouselInner.className = "carousel-inner";

    document.body.appendChild(newCarousel);
    newCarousel.appendChild(newCarouselInner);

    makeCarouselCards(clientId, authToken, "Just Chatting", 1, newCarouselInner.id);

    carouselNumber++;
}
