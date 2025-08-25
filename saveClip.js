// label - likes, dislikes, favorites
export function saveClip(label) {
  let {game, index} = window.currentClipPosition;

  const gameClipsData = window.clipsData[game];
  const clip = gameClipsData[index];

  const jsonSavedClipsData = localStorage.getItem(label);
  const savedClipsData = JSON.parse(jsonSavedClipsData || '[]');

  if (!savedClipsData.some(savedClip => savedClip.id === clip.id)) savedClipsData.push(clip);
  localStorage.setItem(label, JSON.stringify(savedClipsData));
}
