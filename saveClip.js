// label - likes, dislikes, favorites
export function saveClip(label) {
  let {game, index} = window.currentClipPosition;

  const gameClipsData = window.clipsData[game];
  const clipData = gameClipsData[index];

  const jsonSavedClipsData = localStorage.getItem(label);
  const savedClipsData = JSON.parse(jsonSavedClipsData || '[]');

  if (!savedClipsData.some(element => element.id === clipData.id)) savedClipsData.push(clipData);
  localStorage.setItem(label, JSON.stringify(savedClipsData));
}
