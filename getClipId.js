export function getClipId() {
  let {game, index} = window.currentClipPosition;
  const gameClipsData = window.clipsData[game];
  const clipData = gameClipsData[index];
  const clipId = clipData.id;
  return clipId;
}
