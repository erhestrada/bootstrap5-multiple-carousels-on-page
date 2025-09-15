import { displayHeart } from "./display-follow-status";
import { postStreamerFollow, deleteStreamerFollow } from './follows';

// This is for the main page heart buttons
export function followStreamer(userId, streamer, streamerId) {    
    if (!window.follows.streamers.includes(streamer)) {
        window.follows.streamers.push(streamer);
        postStreamerFollow(userId, streamer, streamerId);
    } else {
        window.follows.streamers = window.follows.streamers.filter(followedStreamer => followedStreamer !== streamer);
        deleteStreamerFollow(userId, streamer, streamerId);
    }

    displayHeart('follow-streamer-button', streamer, window.follows.streamers);
    
    return window.follows.streamers;
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