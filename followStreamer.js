import { displayHeart } from "./display-follow-status";
import { postStreamerFollow, deleteStreamerFollow } from './follows';

// This is for the main page heart buttons
export function followStreamer(userId, streamer, streamerId) {    
    let followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};

    if (!(streamer in followedStreamers)) {
        followedStreamers[streamer] = streamerId;
        postStreamerFollow(userId, streamer, streamerId);
    } else {
        delete followedStreamers[streamer];
        deleteStreamerFollow(userId, streamer, streamerId);
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