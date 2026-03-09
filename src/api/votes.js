export async function deleteVote(userId, clipId) {
    try {
        const response = await fetch('http://192.168.86.195:3000/votes', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId, clipId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const voteId = await response.json();
        return voteId;
    
    } catch(error) {
        console.error("Error deleting vote from database", error);
    }
}

export async function getNetVotes(clipId) {
    try {
        // TODO: change abc to meaningful name, avoid conflicting with '/clips/:userId/votes'
        const response = await fetch(`http://192.168.86.195:3000/votes/abc/${clipId}/votes`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const votes = await response.json();
        const netVotes = votes.netVotes || 0; // If no votes on a clip its score is 0
        return netVotes;

    } catch (error) {
        console.error('Error getting net votes for clip', error);
        return 0; // Return score of 0 if can't get net votes
    }
}

export async function getUserVoteOnClip(userId, clipId) {
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

export async function getUserVotes(userId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/votes/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const votesData = await response.json();
        return votesData;

    } catch (error) {
        console.error('Error getting user votes', error);
        return null;
    }
}

export async function postVote(userId, clientId, clipId, vote) {
    try {
        const response = await fetch('http://192.168.86.195:3000/votes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId, clientId, clipId, vote })
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const voteId = await response.json();
        return voteId;
    
    } catch(error) {
        console.error("Error posting vote to database", error);
        throw new Error(`Error posting vote to database: ${error.message}`);
    }
}

