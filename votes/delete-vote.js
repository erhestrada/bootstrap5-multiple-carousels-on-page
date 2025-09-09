export default async function deleteVote(userId, clipId) {
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
