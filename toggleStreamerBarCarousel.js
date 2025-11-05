export function toggleStreamerBarCarousel() {
  const streamerBar = document.querySelector('.streamer-bar');
  streamerBar.classList.toggle('hidden');

  const iframeContainer = document.getElementById('iframe-container');
  iframeContainer.classList.toggle('default-iframe-size'); // On at start first click toggles off
  iframeContainer.classList.toggle('enlarged-iframe-size'); // Off at start first click toggles on

  const iframe = iframeContainer.querySelector('iframe');
  iframe.classList.toggle('enlarged-video'); // Off at start so first toggle switches it on
  iframe.classList.toggle('default-video-size'); // On at start so first toggle switches it off
  const theaterModePfp = document.getElementById('theater-mode-pfp');
  theaterModePfp.classList.toggle('hidden');

  const streamerPfp = document.querySelector('.pfp-image'); 
  const changeCarouselStuff = document.getElementById('change-carousel-buttons-container');

  const prevButton = document.getElementById('clip-player-prev-btn');
  const nextButton = document.getElementById('clip-player-next-btn');

  const theaterModePfpContainer = document.getElementById('theater-mode-pfp-container');
  const expandedClipPlayer = document.getElementById('expanded-clip-player');


  if (iframe.classList.contains('enlarged-video')) {
    theaterModePfp.src = streamerPfp.src; // Set theater mode pfp equal to streamer pfp
    theaterModePfpContainer.appendChild(prevButton); // Add prevButton to pfp container to be in alignment with pfp
    theaterModePfpContainer.appendChild(theaterModePfp); // Add pfp to theater mode pfp container

    const changeContainer = document.getElementById('theater-mode-change-carousel-buttons-container');
    changeContainer.appendChild(nextButton); // Add next button to theater mode change carousels container to be aligned vertically with change carousels buttons
    changeContainer.appendChild(changeCarouselStuff); // Add change carousels element to its container

    expandedClipPlayer.classList.toggle('hidden');
    theaterModePfpContainer.after(iframeContainer); // Move the iframe container after theaterModePfpContainer, where expandedClipPlayer was formerly

    
  } else {
    expandedClipPlayer.classList.toggle('hidden');

    const streamerBar = document.querySelector('.streamer-bar');
    streamerBar.appendChild(changeCarouselStuff);

    const clipPlayer = document.getElementById('clip-player');
    clipPlayer.prepend(prevButton);
    clipPlayer.appendChild(nextButton);

    prevButton.after(iframeContainer);
  }
  
}
