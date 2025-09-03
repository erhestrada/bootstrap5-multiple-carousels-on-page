// load votes per clip (only clips with votes)
export function loadVotes() {

}

// load comments per clip (only clips with comments)
export function loadComments() {

}

// upvotes downvotes favorites comments
export async function loadUserActivity(uuid) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/${uuid}/activity`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const userActivity = await response.json();
        return userActivity;
        
    } catch(error) {
        console.error("Error loading user activity", error);
        throw new Error(`loadUserActivity failed: ${error.message}`);
    }
}

export async function postComment(uuid, comment) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uuid, comment })
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("Error posting comment to database", error);
        throw new Error(`Error posting comment to database: ${error.message}`);
    }

}



export async function updateBondRequest(receiverId, bondedIntentionsJson, updatedStatus) {
    try {
        const response = await fetch('http://192.168.86.195:3000/updateBondRequest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiverId, bondedIntentionsJson, updatedStatus })
        });
          const result = await response.json();
          console.log('Data Stored:', result);
    
      } catch (error) {
          console.error('Error storing data:', error);
      }
}
