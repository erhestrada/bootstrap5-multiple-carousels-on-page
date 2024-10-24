export function makeClipsCarouselSlide(carouselId) {
    //setTimeout(1);

    console.log('sup?');    
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