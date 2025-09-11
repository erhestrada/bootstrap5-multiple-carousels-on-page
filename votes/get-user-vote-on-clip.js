export default async function getUserVoteOnClip(userId, clipId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/votes/${userId}/${clipId}`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const voteData = await response.json();
        const vote = voteData.userVoteOnClip ?? null; // If user hasn't voted on the clip vote is null
        return vote;

    } catch (error) {
        console.error('Error getting user vote on clip', error);
        return null;
    }
}