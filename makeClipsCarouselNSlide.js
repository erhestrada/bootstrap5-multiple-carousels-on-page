export function makeClipsCarouselSlide(carouselId) {
    const carouselInner = document.querySelector(`#${carouselId} .carousel-inner`);
    const nextBtn = document.querySelector(`#${carouselId} .carousel-control-next`);
    const prevBtn = document.querySelector(`#${carouselId} .carousel-control-prev`);

    // Exit if any elements are missing
    if (!carouselInner || !nextBtn || !prevBtn) {
        console.warn(`Missing carousel parts for ID: ${carouselId}`);
        return;
    }

    // Get the visible width of the carousel (how far to scroll per click)
    const scrollAmount = carouselInner.offsetWidth;

    nextBtn.addEventListener("click", () => {
        console.log("Right button clicked");
        carouselInner.scrollBy({
            left: scrollAmount,
            behavior: "smooth"
        });
    });

    prevBtn.addEventListener("click", () => {
        console.log("Left button clicked");
        carouselInner.scrollBy({
            left: -scrollAmount,
            behavior: "smooth"
        });
    });
}



/*
export function makeClipsCarouselSlide(carouselId) {
    //setTimeout(1);

    let carouselWidth = document.querySelector('.carousel-inner').scrollWidth;
    let cardWidth = document.querySelector('.carousel-item').offsetWidth;
    let scrollPosition = 0;


    document.querySelector(`#${carouselId} .carousel-control-next`).addEventListener("click", function () {
        console.log("right button clicked!");
        //if (scrollPosition < carouselWidth - cardWidth * 4) {
        if (true) {
            scrollPosition += cardWidth;
            document.querySelector(`#${carouselId} .carousel-inner`).scrollTo({
            left: scrollPosition,
            behavior: "smooth"
            });
        }
        });

    document.querySelector(`#${carouselId} .carousel-control-prev`).addEventListener("click", function () {
        console.log("left button clicked!");
        if (scrollPosition > 0) {
            scrollPosition -= cardWidth;
            document.querySelector(`#${carouselId} .carousel-inner`).scrollTo({
            left: scrollPosition,
            behavior: "smooth"
            });
        }
        });
}
*/
