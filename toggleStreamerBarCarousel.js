export function toggleStreamerBarCarousel() {
  const streamerBar = document.querySelector('.streamer-bar');
  streamerBar.classList.toggle('hidden');

  const iframeContainer = document.getElementById('iframe-container');
  const iframe = iframeContainer.querySelector('iframe');
  iframe.classList.toggle('enlarged-video'); // Off at start so first toggle switches it on
  iframe.classList.toggle('default-video-size'); // On at start so first toggle switches it off
}
