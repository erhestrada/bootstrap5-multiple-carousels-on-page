import { API_URL } from "./apiConfig.js";

export async function getTopClipsFromBackend(userId, clipTwitchId) {
    try {
        const response = await fetch(API_URL + 'clips/top', {
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
        console.error("Error getting top clips", error);
        throw new Error(`Error getting top clips: ${error.message}`);
    }
}
