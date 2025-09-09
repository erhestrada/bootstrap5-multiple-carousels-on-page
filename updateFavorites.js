import { saveClip, removeClip } from "./updateVotes.js";
import { postFavorite, deleteFavorite } from "./favorites/index.js";
import { getClipId } from "./getClipId.js";

export function updateFavorites(button) {
  const favoriteIcon = button.querySelector('.favorite-icon');
  const favoritesStorageKey = 'favoritedClips';

  const isFavorited = favoriteIcon.classList.toggle('favorited'); // true if class added, false if class removed

  favoriteIcon.classList.toggle('bi-star-fill', isFavorited); // filled if favorited
  favoriteIcon.classList.toggle('bi-star', !isFavorited); // empty if not favorited

  const userId = window.userId;
  const clipId = getClipId();

  if (isFavorited) {
    saveClip(favoritesStorageKey);
    postFavorite(userId, clipId);
  } else {
    removeClip(favoritesStorageKey);
    deleteFavorite(userId, clipId);
  }
}