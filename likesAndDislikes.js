//display likes
const likedClipsUrls = JSON.parse(localStorage.getItem('liked-clips'));
likedClipsUrls.forEach((url, index) => displayClip(url, index));



//display dislikes
const dislikedClipsUrls = JSON.parse(localStorage.getItem('disliked-clips'));


function displayClip(url, index) {  
    const iframe = document.createElement('iframe');
  
    iframe.src = url.replace("autoplay=true", "autplay=false");
  
    iframe.height = '360';
    iframe.width = '640';
    iframe.allowFullscreen = true;
    
    document.body.appendChild(iframe);
  
  }