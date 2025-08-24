import { saveClip, removeClip } from "./updateVotes.js";

export function updateFavorites(button) {
  const favoriteIcon = button.querySelector('.favorite-icon');
  const isFavorited = favoriteIcon.classList.contains('favorited');
  const favoritesStorageKey = 'favoritedClips';

  if (isFavorited) {
    favoriteIcon.classList.remove('favorited'); // Remove fill color
    favoriteIcon.classList.remove('bi-star-fill');
    favoriteIcon.classList.add('bi-star');
    removeClip(favoritesStorageKey);
  } else {
    favoriteIcon.classList.add('favorited'); // Add fill color
    favoriteIcon.classList.remove('bi-star');
    favoriteIcon.classList.add('bi-star-fill');
    saveClip(favoritesStorageKey);
  }
}
