export function positionCarouselTabButtons() {
    const carouselTabButtons = document.querySelector('.carousel-tab-buttons');
    const stickyStuff = document.querySelector('.sticky-stuff');

    const stickyStuffHeight = stickyStuff.getBoundingClientRect().height;
    carouselTabButtons.style.top = `${stickyStuffHeight}px`;
}
