import { saveClip, removeClip } from "./updateVotes.js";

export function updateFavorites(button) {
  const favoriteIcon = button.querySelector('.favorite-icon');
  const isFavorited = favoriteIcon.classList.contains('favorited');
  const favoritesStorageKey = 'favoritedClips';

  if (isFavorited) {
    favoriteIcon.classList.remove('favorited');
    removeClip(favoritesStorageKey);
  } else {
    favoriteIcon.classList.add('favorited');
    saveClip(favoritesStorageKey);
  }
}