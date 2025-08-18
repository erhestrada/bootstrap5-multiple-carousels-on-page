export let carouselIsSliding = false;

export function elementInViewHorizontally(element, padding = 0) {
    if (!element) return false;

    const elRect = element.getBoundingClientRect();
    const container = element.closest('.carousel-row');
    if (!container) return false;

    const containerRect = container.getBoundingClientRect();

    if (elRect.left < containerRect.left + padding) {
        return 'left';
    }

    if (elRect.right > containerRect.right - padding) {
        return 'right';
    }

    return 'visible';
}

export function slideCarousel(carouselName, direction) {
    carouselIsSliding = true;

    // Get carousel within carousel row
    //const carousel = document.getElementById(`${carouselId}-row`).querySelector('.carousel');
    const carouselInstance = window.carouselInstances[carouselName];

    if (direction === "right") {
        carouselInstance.nextSlide();
    } else if (direction === "left") {
        carouselInstance.prevSlide();
    } else if (direction === "reset") {
    }


    setTimeout(() => {
        carouselIsSliding = false;
    }, 400);
}

// if clipPlayer open ...
// if clipPlayer closed ...
export function elementInViewVertically(element, padding = 0) {
    if (!element) return false;

    const elementRect = element.getBoundingClientRect();
    const stickyHeight = getHeightOfElement('.sticky-stuff');

    if (elementRect.top < stickyHeight) {
        return 'above';
    }

    if (elementRect.bottom > window.innerHeight - padding) {
        return 'below';
    }

    return 'visible';
}

// if highlighted thumbnail below viewport
export function scrollDownToThumbnail() {
    const carouselHeight = getHeightOfElement('.category-carousel-row');

    window.scrollBy({
        top: carouselHeight,
        left: 0,
        behavior: 'smooth'
    });
}

// have to scroll up by more because of the header
export function scrollUpToThumbnail() {
    const carouselHeight = getHeightOfElement('.category-carousel-row');

    window.scrollBy({
        top: -carouselHeight, // negative to scroll up
        left: 0,
        behavior: 'smooth'
    });
}

function getHeightOfElement(selector) {
    const element = document.querySelector(selector);
    return element ? element.offsetHeight : 0;
}
