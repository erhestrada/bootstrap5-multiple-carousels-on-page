export function saveClip(category) {
    const currentClipUrl = localStorage.getItem("currentClipUrl");
    const jsonClipUrls = localStorage.getItem(category);
    const clipUrls = JSON.parse(jsonClipUrls || '[]');
    clipUrls.push(currentClipUrl);
    localStorage.setItem(category, JSON.stringify(clipUrls));
  }
