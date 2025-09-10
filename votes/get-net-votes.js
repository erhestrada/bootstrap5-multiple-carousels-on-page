export async function getNetVotes(clipId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/votes/${clipId}`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const votes = await response.json();
        const netVotes = votes.netVotes;
        return netVotes;

    } catch (error) {
        console.error('Error getting net votes for clip', error);
        return null;
    }
}