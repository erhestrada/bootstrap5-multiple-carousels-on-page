// should really save clipData

export function saveClip(label) {
    let {game, index} = window.currentClipPosition;

    const gameClipsData = clipsData[game].data;
    const thumbnailUrl = clipsData[game].data[index].thumbnail_url;

    console.log(thumbnailUrl);

    
    const jsonClipUrls = localStorage.getItem(label);
    const clipUrls = JSON.parse(jsonClipUrls || '[]');
    clipUrls.push(thumbnailUrl);
    localStorage.setItem(label, JSON.stringify(clipUrls));
    
  }
