export default async function postClipToHistory(userId, clipTwitchId) {
    try {
        const response = await fetch('http://192.168.86.195:3000/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId, clipTwitchId})
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const voteId = await response.json();
        return voteId;
    
    } catch(error) {
        console.error("Error inserting clip into history table in database", error);
        throw new Error(`Error inserting clip into history table in database: ${error.message}`);
    }
}
