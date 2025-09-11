import { getFavoriteStatusOfClip } from './favorites'

export async function displayFavoriteStatusOfClip(userId, clipId) {
  try {
    const favorited = await getFavoriteStatusOfClip(userId, clipId);

    const favoriteButton = document.getElementById('favorite-button');
    const favoriteIcon = favoriteButton.querySelector('.favorite-icon');

    // Reset favoriteIcon to empty star
    favoriteIcon.classList.remove('favorited');
    favoriteIcon.classList.remove('bi-star-fill');
    favoriteIcon.classList.add('bi-star');

    if (favorited) {
      favoriteIcon.classList.add('favorited');
      favoriteIcon.classList.replace('bi-star', 'bi-star-fill');
    }
  } catch (error) {
    console.error('Failed to display vote:', error);
  }
}