export function followStreamer(streamerId) {
    let followedStreamers = loadArrayFromLocalStorage('followedStreamers');
    if (!followedStreamers.includes(streamerId)) {
        followedStreamers.push(streamerId);
    }
    saveDataToLocalStorage('followedStreamers', followedStreamers);
    console.log(followedStreamers);
    return followedStreamers;
}

export function loadArrayFromLocalStorage(key) {
    const jsonIntentionsLog = localStorage.getItem(key) ?? JSON.stringify([]);
    const intentionsLog = JSON.parse(jsonIntentionsLog);
    return intentionsLog
}

export function saveDataToLocalStorage(key, data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
    return jsonData
  }