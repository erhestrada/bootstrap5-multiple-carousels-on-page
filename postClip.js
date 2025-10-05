export async function postClip(clip) {
    try {
        const response = await fetch('http://192.168.86.195:3000/clips', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(clip)
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const voteId = await response.json();
        return voteId;
    
    } catch(error) {
        console.error("Error posting clip to database", error);
        throw new Error(`Error posting clip to database: ${error.message}`);
    }
}
