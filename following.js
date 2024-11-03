function displayFollowedStreamers() {
    const followedStreamersContainer = document.getElementById('followed-streamers-container');
    const followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};
    
    for (const streamerName in followedStreamers) {
        const streamerNameElement = document.createElement('p');
        streamerNameElement.innerText = streamerName;
        followedStreamersContainer.appendChild(streamerNameElement);
    }
}

displayFollowedStreamers();