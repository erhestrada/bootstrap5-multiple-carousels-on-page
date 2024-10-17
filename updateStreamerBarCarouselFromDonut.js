import { updateStreamerBarCarousel } from './updateStreamerBarCarousel.js'

export function updateStreamerBarCarouselFromDonut(daysBack) {
    let carousel2 = document.getElementById('carousel2');
    const carousel2Inner = document.getElementById('carousel2-inner');
    carousel2Inner.innerHTML = '';
  
    const currentStreamerId = localStorage.getItem('currentClipStreamerId');
    updateStreamerBarCarousel(currentStreamerId, daysBack);
  
    carousel2 = new bootstrap.Carousel(document.querySelector('#carousel2'));

}
