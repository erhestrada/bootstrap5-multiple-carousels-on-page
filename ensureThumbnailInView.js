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

export function slideCarousel(carouselId, direction) {
    const carouselInner = document.querySelector(`#${carouselId} .carousel-inner`);

    let scrollAmount;
    if (direction === "right") {
        scrollAmount = carouselInner.offsetWidth;
    } else {
        scrollAmount = -carouselInner.offsetWidth;
    }

    carouselInner.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
    });
}

export function elementInViewVertically() {

}

// if highlighted thumbnail below viewport
export function scrollDownToThumbnail() {

}
