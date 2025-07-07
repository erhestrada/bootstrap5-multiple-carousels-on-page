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
