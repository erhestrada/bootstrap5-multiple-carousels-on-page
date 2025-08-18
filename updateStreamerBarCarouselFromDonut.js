import { updateStreamerBarCarousel } from './updateStreamerBarCarousel.js'

export function updateStreamerBarCarouselFromDonut(daysBack) {  
    updateStreamerBarCarousel(window.currentStreamerId, daysBack);
}
