document.addEventListener('DOMContentLoaded', function() {    
    if (window.matchMedia("(min-width: 768px)").matches) {      
      let carouselWidth = document.querySelector('.carousel-inner').scrollWidth;
      let cardWidth = document.querySelector('.carousel-item').offsetWidth;
      let scrollPosition = 0;
  
      document.querySelector("#carousel2 .carousel-control-next").addEventListener("click", function () {
        console.log("right button clicked!");
        //if (scrollPosition < carouselWidth - cardWidth * 4) {
        if (true) {
          scrollPosition += cardWidth;
          document.querySelector("#carousel2 .carousel-inner").scrollTo({
            left: scrollPosition,
            behavior: "smooth"
          });
        }
      });
  
      document.querySelector("#carousel2 .carousel-control-prev").addEventListener("click", function () {
        console.log("left button clicked!");
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          document.querySelector("#carousel2 .carousel-inner").scrollTo({
            left: scrollPosition,
            behavior: "smooth"
          });
        }
      });
    } 
  });