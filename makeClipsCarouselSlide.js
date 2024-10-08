document.addEventListener('DOMContentLoaded', function() {
    const multipleCardCarousel = document.querySelector("#carouselExample");
    
    if (window.matchMedia("(min-width: 768px)").matches) {
      const carousel = new bootstrap.Carousel(multipleCardCarousel, {
        interval: false,
      });
      
      let carouselWidth = document.querySelector('.carousel-inner').scrollWidth;
      let cardWidth = document.querySelector('.carousel-item').offsetWidth;
      let scrollPosition = 0;

      console.log(carouselWidth);
      console.log(cardWidth);
  
      document.querySelector("#carouselExample .carousel-control-next").addEventListener("click", function () {
        console.log("right button clicked!");
        //if (scrollPosition < carouselWidth - cardWidth * 4) {
        if (true) {
          scrollPosition += cardWidth;
          document.querySelector("#carouselExample .carousel-inner").scrollTo({
            left: scrollPosition,
            behavior: "smooth"
          });
        }
      });
  
      document.querySelector("#carouselExample .carousel-control-prev").addEventListener("click", function () {
        console.log("left button clicked!");
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          document.querySelector("#carouselExample .carousel-inner").scrollTo({
            left: scrollPosition,
            behavior: "smooth"
          });
        }
      });
    } else {
      multipleCardCarousel.classList.add("slide");
    }
  });