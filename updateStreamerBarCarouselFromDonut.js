import { updateStreamerBarCarousel } from './updateStreamerBarCarousel.js'

export function updateStreamerBarCarouselFromDonut() {
    let carousel2 = document.getElementById('carousel2');
    const carousel2Inner = document.getElementById('carousel2-inner');
    carousel2Inner.innerHTML = '';
  
    const currentStreamerId = localStorage.getItem('currentClipStreamerId');
    updateStreamerBarCarousel(currentStreamerId, 7); // needs to match daysBack from button
  
    carousel2 = new bootstrap.Carousel(document.querySelector('#carousel2'));

}
