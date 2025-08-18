import { updateStreamerBarCarousel } from './updateStreamerBarCarousel.js'

export function updateStreamerBarCarouselFromDonut(daysBack) {  
    const currentStreamerId = localStorage.getItem('currentClipStreamerId');
    updateStreamerBarCarousel(currentStreamerId, daysBack);
}
