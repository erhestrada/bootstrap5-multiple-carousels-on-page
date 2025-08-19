function updateFollowButton(streamer, category) {
    const followButton = document.getElementById('compound-follow-button');
    const followedStreamers = JSON.parse(localStorage.getItem('followedStreamers'));
    const followedCategories = JSON.parse(localStorage.getItem('folloedCategories'));

    displayHeart(streamer, followedStreamers);
    displayHeart(category, followedCategories);
}

function displayHeart(value, list) {
    if (followedStreamers.includes(streamer)) {

    } else {

    }
}