import { displayHeart } from "./display-follow-status";
import { postFollow, deleteFollow } from './follows';

export function followStreamer(userId, streamer, streamerId) {    
    let followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};

    if (!(streamer in followedStreamers)) {
        followedStreamers[streamer] = streamerId;
        postFollow(userId, streamer, streamerId);
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