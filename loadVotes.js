// load votes per clip (only clips with votes)
export function loadVotes() {

}

// load comments per clip (only clips with comments)
export function loadComments() {

}

// upvotes downvotes favorites comments
export async function loadUserActivity(uuid) {
    try {
        const response = await fetch(`https://192.168.86.195:3000/${uuid}/activity`);

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

