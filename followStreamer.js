import { displayHeart } from "./display-follow-status";
import { postStreamerFollow, deleteFollow } from './follows';

// This is for the main page heart buttons
export function followStreamer(userId, streamer, streamerId) {    
    let followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};

    if (!(streamer in followedStreamers)) {
        followedStreamers[streamer] = streamerId;
        postFollow(userId, streamer, streamerId);
    } else {
        delete followedStreamers[streamer];
        deleteFollow(userId, streamer, streamerId);
    }

    localStorage.setItem('followedStreamers', JSON.stringify(followedStreamers));
    displayHeart('follow-streamer-button', streamer, followedStreamers);
    
    return followedStreamers;
}

// This is in the follows page, not the main page
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