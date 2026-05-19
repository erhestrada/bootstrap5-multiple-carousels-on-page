import { API_URL } from "./apiConfig.js";

export async function getTopClipsFromBackend(userId, clipTwitchId) {
    try {
        const response = await fetch(API_URL + 'clips/top', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
		    id: twitchId, url, 
		    embed_url, 
		    broadcaster_id, 
		    broadcaster_name, 
		    creator_id, 
		    creator_name, 
		    video_id, 
		    game_id, 
		    language, 
		    title, 
		    view_count, 
		    created_at, 
		    thumbnail_url, 
		    duration
		  })
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
