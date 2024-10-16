import { updateStreamerBarCarousel } from './updateStreamerBarCarousel.js'

export function updateStreamerBarCarouselFromDonut() {
    const currentStreamerId = localStorage.getItem('currentClipStreamerId');
    updateStreamerBarCarousel(currentStreamerId, 7); // needs to match daysBack from button
}
