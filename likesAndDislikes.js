//display likes
const likedClipsUrls = JSON.parse(localStorage.getItem('liked-clips'));
likedClipsUrls.forEach(url=> displayClip(url, 'likes-container'));


const dislikedClipsUrls = JSON.parse(localStorage.getItem('disliked-clips'));
dislikedClipsUrls.forEach(url => displayClip(url, 'dislikes-container'));

function displayClip(url, containerId) {  
    const iframe = document.createElement('iframe');
  
    iframe.src = url.replace("autoplay=true", "autplay=false");
  
    iframe.height = '360';
    iframe.width = '640';
    iframe.allowFullscreen = true;
    
    const likesContainer = document.getElementById(containerId);
    likesContainer.appendChild(iframe);
  
  }