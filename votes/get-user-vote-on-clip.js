export async function getUserVoteOnClip(userId, clipId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/votes/${userId}/${clipId}`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const votes = await response.json();
        const netVotes = votes.netVotes || 0; // If no votes on a clip its default score is 0
        return netVotes;

    } catch (error) {
        console.error('Error getting user vote on clip', error);
        return null;
    }
}