export function toggleStreamerBarCarousel() {
  const streamerBarCarousel = document.getElementById('id-streamer-bar-carousel-carousel-row');
  streamerBarCarousel.classList.toggle('hidden');

  const iframeContainer = document.getElementById('iframe-container');
  iframeContainer.style.position = 'relative';
  iframeContainer.style.width = '928px';
  iframeContainer.style.height = '522px';
  const iframe = iframeContainer.querySelector('iframe');
  iframe.classList.toggle('enlarged-video');
}
