export function openPopUpPlayer(streamer, index, embedUrls) {
    //replaceCarouselItem(index, embedUrls, streamerIds);
    openPopUp();
    embedIframe(embedUrls[index]+"&parent=localhost&autoplay=true");

    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            if (index > 0) {
                index--;
                embedIframe(window.embedUrls[streamer][index]+"&parent=localhost&autoplay=true");
            }
        } else if (event.key === 'ArrowRight') {
            if (index < window.embedUrls[streamer].length - 1) {
                index++;
                embedIframe(window.embedUrls[streamer][index]+"&parent=localhost&autoplay=true");
            } else {
                console.log('here!');
                const streamers = Object.keys(window.embedUrls);
                const streamerIndex = streamers.indexOf(streamer);
            
                if (streamerIndex < streamers.length - 1) {
                    console.log('in here!');
                    streamer = streamers[streamerIndex + 1];
                    index = 0;
                    console.log('next streamer:', streamer);
                    embedIframe(window.embedUrls[streamer][index]+"&parent=localhost&autoplay=true");
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