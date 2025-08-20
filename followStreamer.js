import { displayHeart } from "./updateFollowButton";

export function followStreamer(streamer, streamerId) {
    console.log('in follow streamer');
    console.log('streamer', streamer);
    
    let followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};

    if (!(streamer in followedStreamers)) {
        followedStreamers[streamer] = streamerId;
    } else {
        delete followedStreamers[streamer]; // <-- this makes it toggle
    }

    localStorage.setItem('followedStreamers', JSON.stringify(followedStreamers));
    displayHeart('follow-streamer-button', streamer, followedStreamers);
    
    return followedStreamers;
}

export function unfollowStreamer(streamerName) {
    let followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};
    delete followedStreamers[streamerName];
    localStorage.setItem('followedStreamers', JSON.stringify(followedStreamers));
    location.reload();
    return followedStreamers
}

export function saveDataToLocalStorage(key, data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
    return jsonData
}