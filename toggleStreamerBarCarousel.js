export function toggleStreamerBarCarousel() {
  const streamerBarCarousel = document.getElementById('id-streamer-bar-carousel-carousel-row');
  streamerBarCarousel.classList.toggle('hidden');

  const iframeContainer = document.getElementById('iframe-container');
  const iframe = iframeContainer.querySelector('iframe');
  iframe.classList.toggle('enlarged-video');

  if (iframe.classList.contains('enlarged-video')) {
    iframeContainer.style.position = 'relative';
    iframeContainer.style.width = '928px';
    iframeContainer.style.height = '522px';
  } else {
    iframeContainer.style.position = '';
    iframeContainer.style.width = '';
    iframeContainer.style.height = '';
  }
}
