export function getOrCreateWatchHistory() {
  let watchHistory = localStorage.getItem('watchHistory');
  if (!watchHistory) {
    watchHistory = [];
    localStorage.setItem('watchHistory', watchHistory);
  }
  return watchHistory;    
}
