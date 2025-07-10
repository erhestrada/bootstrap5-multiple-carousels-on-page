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

export function elementInViewVertically(element, padding = 0) {
    if (!element) return false;

    const rect = element.getBoundingClientRect();

    // viewport's top edge = 0
    // viewport's bottom edge = window.innerHeight

    if (rect.top < 0) {
        return 'above';
    }

    if (rect.bottom > window.innerHeight - padding) {
        return 'below';
    }

    return 'visible';
}

// if highlighted thumbnail below viewport
export function scrollDownToThumbnail(amount = 100) {
    window.scrollBy({
        top: amount,
        left: 0,
        behavior: 'smooth'
    });
}
