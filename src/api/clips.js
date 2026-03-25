export async function getVotedOnClips(userId) {
    try {
        const response = await fetch(API_URL + `clips/${userId}/comments`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const commentedOnClips = await response.json();
        return commentedOnClips;

    } catch (error) {
        console.error('Error getting commented on clips', error);
        return null;
    }
}
export async function getFavoritedClips(userId) {
    try {
        const response = await fetch(API_URL + `clips/${userId}/favorites`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const votesData = await response.json();
        return votesData;

    } catch (error) {
        console.error('Error getting favorited clips', error);
        return null;
    }
}
export async function getHistoryClips(userId) {
    try {
        const response = await fetch(API_URL + `clips/${userId}/history`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const historyClips = await response.json();
        console.log("history clips: ", historyClips);
        const noConsecutiveDuplicatesHistoryClips = historyClips.filter((clip, index, clips) => {  // filter out consecutive duplicate clips to handle refresh spammming
            return index === 0 || clip.history_clip_id !== clips[index - 1].history_clip_id;       // index === 0 handles first clip
        });
        return noConsecutiveDuplicatesHistoryClips;

    } catch (error) {
        console.error('Error getting history clips', error);
        return null;
    }
}
export async function getVotedOnClips(userId) {
    try {
        const response = await fetch(API_URL + `clips/${userId}/votes`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const votesData = await response.json();
        return votesData;

    } catch (error) {
        console.error('Error getting voted on clips', error);
        return null;
    }
}
