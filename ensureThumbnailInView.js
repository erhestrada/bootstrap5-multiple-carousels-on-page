export function ensureThumbnailInView(carouselId, highlightedThumbnail) {
    const carouselInner = document.querySelector(`#${carouselId} .carousel-inner`);
    if (!carouselInner || !highlightedThumbnail) return;

    const containerRect = carouselInner.getBoundingClientRect();
    const thumbRect = highlightedThumbnail.getBoundingClientRect();

    const scrollAmount = carouselInner.offsetWidth;

    // Check if the thumbnail is left of visible area
    if (thumbRect.left < containerRect.left) {
        carouselInner.scrollBy({
            left: thumbRect.left - containerRect.left - 10, // extra padding
            behavior: "smooth"
        });
    }

    // Check if the thumbnail is right of visible area
    else if (thumbRect.right > containerRect.right) {
        carouselInner.scrollBy({
            left: thumbRect.right - containerRect.right + 10, // extra padding
            behavior: "smooth"
        });
    }
}

export function elementIsInView(element, container, padding = 0) {
    console.log('element', element);
    console.log('container', container);
    if (!container || !element) return false;
    console.log('hey?');

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    console.log('elementRect', elementRect);
    console.log('container rect', containerRect);

    return (
        elementRect.left >= containerRect.left + padding &&
        elementRect.right <= containerRect.right - padding
    );
}