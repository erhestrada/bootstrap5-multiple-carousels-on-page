export function toggleStreamerBarCarousel() {
  const streamerBar = document.querySelector('.streamer-bar');
  streamerBar.classList.toggle('hidden');

  const iframeContainer = document.getElementById('iframe-container');
  const iframe = iframeContainer.querySelector('iframe');
  iframe.classList.toggle('enlarged-video');

  iframe.style.width = "90%";
  iframe.style.height = "auto";
  iframe.style.aspectRatio = "16 / 9";

  if (!iframe.classList.contains('enlarged-video')) {
    iframe.style.height = "360px";
    iframe.style.width = "640px";
  }
}
