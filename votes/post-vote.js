export default async function postVote(userId, clientId, clipId, vote) {
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
