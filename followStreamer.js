export function followStreamer(streamer, streamerId) {
    console.log('in follow streamer');
    console.log('streamer', streamer);
    
    let followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};

    if (!(streamer in followedStreamers)) {
        followedStreamers[streamer] = streamerId;
    }
    localStorage.setItem('followedStreamers', JSON.stringify(followedStreamers));
    
    console.log(followedStreamers);
    return followedStreamers;
}

export function unfollowStreamer(streamerName) {
    let followedStreamers = JSON.parse(localStorage.getItem('followedStreamers')) || {};
    delete followedStreamers.streamerName;
    localStorage.setItem('followedStreamers', JSON.stringify(followedStreamers));
    return followedStreamers
}


export function saveDataToLocalStorage(key, data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
    return jsonData
  }