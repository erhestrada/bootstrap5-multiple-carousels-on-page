export function updateFollowButton(streamer, category) {
    const followedStreamers = JSON.parse(localStorage.getItem('followedStreamers') || '{}');
    const followedCategories = JSON.parse(localStorage.getItem('followedCategories') || '{}');

    displayHeart('follow-streamer-button', streamer, followedStreamers);
    displayHeart('follow-category-button', category, followedCategories);
}

function displayHeart(elementId, value, object) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const icon = element.querySelector('i');
    if (!icon) return;

    if (value in object) {
        icon.className = 'bi bi-heart-fill';
    } else {
        icon.className = 'bi bi-heart';
    }
}