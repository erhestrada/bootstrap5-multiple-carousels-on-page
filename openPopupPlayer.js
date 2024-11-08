export function openPopUpPlayer(streamer, index, embedUrls) {
    //replaceCarouselItem(index, embedUrls, streamerIds);
    openPopUp();
    embedIframe(embedUrls[index]+"&parent=localhost&autoplay=true");

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            if (index > 0) {
                embedIframe(window.embedUrls[streamer][index-1]+"&parent=localhost&autoplay=true");
            }
        } else if (event.key === 'ArrowRight') {
            if (index < window.embedUrls[streamer].length) {
                embedIframe(window.embedUrls[streamer][index+1]+"&parent=localhost&autoplay=true");
            } else {
                const streamers = Object.keys(window.embedUrls);
                streamerIndex = streamers.indexOf(streamer);
                if (streamerIndex < streamers.length) {
                    streamer = streamers[streamerIndex + 1];
                    embedIframe(window.embedUrls[streamer][0]+"&parent=localhost&autoplay=true");
                }
            }
        }
      });

  }
  
  function openPopUp() {
    document.getElementById('popup').style.display = 'block';
  }
  
  export function closePopUp() {
    document.getElementById('popup').style.display = 'none';
    // close the clip when the popup is closed
    const iframeContainer = document.getElementById('iframe-container');
    iframeContainer.innerHTML = '';
  }
  
  // Close the popup when clicking outside of it
  window.onclick = function(event) {
    const popup = document.getElementById('popup');
    if (event.target == popup) {
        closePopUp();
    }
  }
  
  function embedIframe(url) {
    localStorage.setItem('currentClipUrl', url);
    const iframeContainer = document.getElementById('iframe-container');
    iframeContainer.innerHTML = ''; // Clear previous content
  
    const iframe = document.createElement('iframe');
    iframe.src = url; // Set the iframe source
    iframe.style.width = 640; // Set width
    iframe.style.height = 360; // Set height
    iframe.frameBorder = 0;
    iframe.allowFullscreen = true;
  
    iframe.style.width = '100%'; // Full width of the container
    iframe.style.height = '100%'; // Full height of the container
  
    iframeContainer.appendChild(iframe); // Append the iframe to the container
  }