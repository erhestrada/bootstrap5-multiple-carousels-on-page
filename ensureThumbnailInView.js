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
export function scrollDownToThumbnail(amount = 325) {
    window.scrollBy({
        top: amount,
        left: 0,
        behavior: 'smooth'
    });
}

export function scrollUpToThumbnail(amount = 325) {
    window.scrollBy({
        top: -amount, // negative to scroll up
        left: 0,
        behavior: 'smooth'
    });
}

function getHeightOfElement(selector) {
    const element = document.querySelector(selector);
    return element ? element.offsetHeight : 0;
}
