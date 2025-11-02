export function toggleStreamerBarCarousel() {
  const streamerBar = document.querySelector('.streamer-bar');
  streamerBar.classList.toggle('hidden');

  const iframeContainer = document.getElementById('iframe-container');
  const iframe = iframeContainer.querySelector('iframe');
  iframe.classList.toggle('enlarged-video'); // Off at start so first toggle switches it on
  iframe.classList.toggle('default-video-size'); // On at start so first toggle switches it off
  const theaterModePfp = document.getElementById('theater-mode-pfp');
  theaterModePfp.classList.toggle('hidden');

  const streamerPfp = document.querySelector('.pfp-image'); 
  const changeCarouselStuff = document.getElementById('change-carousel-buttons-container');

  const prevButton = document.getElementById('clip-player-prev-btn');
  const nextButton = document.getElementById('clip-player-next-btn');

  if (iframe.classList.contains('enlarged-video')) {
    const pfpContainer = document.getElementById('theater-mode-pfp-container');
    theaterModePfp.src = streamerPfp.src;
    pfpContainer.appendChild(prevButton);
    pfpContainer.appendChild(theaterModePfp);


    const changeContainer = document.getElementById('theater-mode-change-carousel-buttons-container');
    changeContainer.appendChild(nextButton);
    changeContainer.appendChild(changeCarouselStuff);
  } else {
    const streamerBar = document.querySelector('.streamer-bar');
    streamerBar.prepend(pfp);
    streamerBar.appendChild(changeCarouselStuff);

  }
}
