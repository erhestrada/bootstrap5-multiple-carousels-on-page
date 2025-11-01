export function toggleStreamerBarCarousel() {
  //const historyContainer = document.getElementById('history-container');
  //historyContainer.classList.toggle('hidden');

  //const commentsSection = document.getElementById('comments-section');
  //commentsSection.classList.toggle('hidden');

  const streamerBar = document.querySelector('.streamer-bar');
  streamerBar.classList.toggle('hidden');

  /*
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
  */
}
