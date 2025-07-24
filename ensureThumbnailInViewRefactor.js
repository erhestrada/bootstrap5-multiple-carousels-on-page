export let carouselIsSliding = false;

export function elementInViewHorizontally(element, padding = 0) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();

    // viewport's left edge = 0
    // viewport's right edge = window.innerWidth

    if (rect.left < 0) {
        return 'left';
    }

    if (rect.right > window.innerWidth - padding) {
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
    //const carouselHeight = getHeightOfElement('.carousel-inner.thumbnails-carousel-inner');
    //const carouselHeight = getHeightOfElement('.carousel-row');
    const carouselHeight = 300;
    console.log('carousel height: ', carouselHeight);

    window.scrollBy({
        top: carouselHeight,
        left: 0,
        behavior: 'smooth'
    });
}

// have to scroll up by more because of the header
export function scrollUpToThumbnail() {
    const carouselHeight = getHeightOfElement('.carousel-inner.thumbnails-carousel-inner');
    console.log('carousel height: ', carouselHeight);

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
