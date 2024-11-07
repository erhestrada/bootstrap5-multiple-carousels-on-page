function displayFollowedStreamers() {
    const followedStreamersContainer = document.getElementById('followed-streamers-container');
    const followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};
    
    for (const streamerName in followedStreamers) {
        const streamerEntry = document.createElement('div');
        streamerEntry.style.display = 'flex';

        const streamerNameElement = document.createElement('p');
        streamerNameElement.innerText = streamerName;
        streamerEntry.appendChild(streamerNameElement);

        const unfollowButton = document.createElement('button');
        unfollowButton.innerText = 'unfollow';
        streamerEntry.appendChild(unfollowButton);

        followedStreamersContainer.appendChild(streamerEntry);

    }
}

displayFollowedStreamers();