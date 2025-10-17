export function toggleStreamerBarCarousel() {
    const streamerBarCarousel = document.getElementById('id-streamer-bar-carousel-carousel-row');
    streamerBarCarousel.style.display = 'none';

    const iframeContainer = document.getElementById('iframe-container');
    const iframe = iframeContainer.querySelector('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
}
