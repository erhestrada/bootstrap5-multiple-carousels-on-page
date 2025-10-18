export function toggleStreamerBarCarousel() {
  const streamerBarCarousel = document.getElementById('id-streamer-bar-carousel-carousel-row');
  streamerBarCarousel.classList.toggle('hidden');

  const iframeContainer = document.getElementById('iframe-container');
  const iframe = iframeContainer.querySelector('iframe');
  iframe.classList.toggle('enlarged-video');
}
