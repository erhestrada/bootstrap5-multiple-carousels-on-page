export function updateFollowButton(streamer, category) {
    const followButton = document.getElementById('compound-follow-button');
    const followedStreamers = JSON.parse(localStorage.getItem('followedStreamers') || '{}');
    const followedCategories = JSON.parse(localStorage.getItem('followedCategories') || '{}');

    displayHeart(streamer, followedStreamers);
    displayHeart(category, followedCategories);
}

function displayHeart(value, object) {
    if (value in object) {

    } else {

    }
}