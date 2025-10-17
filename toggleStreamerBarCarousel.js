export function toggleStreamerBarCarousel() {
  const streamerBarCarousel = document.getElementById('id-streamer-bar-carousel-carousel-row');
  streamerBarCarousel.classList.toggle('hidden');

  const iframeContainer = document.getElementById('iframe-container');
  const iframe = iframeContainer.querySelector('iframe');
  iframe.style.width = '928px';
  iframe.style.height = '522px';  // somewhere between 854-480 and 960-540
}
