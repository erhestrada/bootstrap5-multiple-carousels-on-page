import { saveClip, removeClip } from "./updateVotes.js";

export function updateFavorites(button) {
  const favoriteIcon = button.querySelector('.favorite-icon');
  const favoritesStorageKey = 'favoritedClips';

  const isFavorited = favoriteIcon.classList.toggle('favorited'); // true if class added, false if class removed

  favoriteIcon.classList.toggle('bi-star-fill', isFavorited); // filled if favorited
  favoriteIcon.classList.toggle('bi-star', !isFavorited); // empty if not favorited

  if (isFavorited) {
    saveClip(favoritesStorageKey);
  } else {
    removeClip(favoritesStorageKey);
  }
}