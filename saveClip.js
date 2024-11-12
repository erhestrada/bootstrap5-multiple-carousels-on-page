// should really save clipData

export function saveClip(category) {
    let {game, index} = window.currentClipPosition;

    const gameClipsData = clipsData[game].data;
    const thumbnailUrl = clipsData[game].data[index].thumbnail_url;

    console.log(thumbnailUrl);

    
    const jsonClipUrls = localStorage.getItem(category);
    const clipUrls = JSON.parse(jsonClipUrls || '[]');
    clipUrls.push(thumbnailUrl);
    localStorage.setItem(category, JSON.stringify(clipUrls));
    
  }
