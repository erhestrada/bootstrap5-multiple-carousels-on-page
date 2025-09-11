import { getUserFavoriteOnClip } from './favorites'

export async function displayUserFavoriteOnClip(userId, clipId) {
  try {
    // true or false
    const favorited = await getUserFavoriteOnClip(userId, clipId);

    const favoriteButton = document.getElementById('favorite-button');
    const favoriteIcon = favoriteButton.querySelector('.favorite-icon');

    favoriteIcon.classList.remove('favorited');

    if (favorited) {
      favoriteIcon.classList.add('favorited');
    } 
  } catch (error) {
    console.error('Failed to display vote:', error);
  }
}