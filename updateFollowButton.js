export function initializeFollowButton(streamer, category) {
    const followedStreamers = JSON.parse(localStorage.getItem('followedStreamers') || '{}');
    const followedCategories = JSON.parse(localStorage.getItem('followedCategories') || '{}');

    displayHeart('follow-streamer-button', streamer, followedStreamers);
    displayHeart('follow-category-button', category, followedCategories);
}

export function displayHeart(buttonId, name, follows) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    const icon = button.querySelector('i');
    if (!icon) return;

    if (name in follows) {
        icon.className = 'bi bi-heart-fill';
    } else {
        icon.className = 'bi bi-heart';
    }
}
