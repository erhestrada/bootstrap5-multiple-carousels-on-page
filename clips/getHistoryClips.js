export default async function getHistoryClips(userId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/clips/${userId}/history`);

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
