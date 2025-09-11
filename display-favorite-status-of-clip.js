import { getFavoriteStatusOfClip } from './favorites'

export async function displayFavoriteStatusOfClip(userId, clipId) {
  try {
    // true or false
    const favorited = await getFavoriteStatusOfClip(userId, clipId);

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