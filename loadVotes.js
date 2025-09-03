// load votes per clip (only clips with votes)
export function loadVotes() {

}

// load comments per clip (only clips with comments)
export function loadComments() {

}

// upvotes downvotes favorites comments
export async function loadUserActivity(userId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/${userId}/activity`);

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

export async function postComment(userId, comment) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, comment })
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const postedComment = await response.json();
        return postedComment;

    } catch (error) {
        console.error("Error posting comment to database", error);
        throw new Error(`Error posting comment to database: ${error.message}`);
    }
}

