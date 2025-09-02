const uuid = 1;

export function loadVotes() {

}

// upvotes downvotes favorites comments
export async function loadUserActivity() {
    try {
        const response = await fetch(`https://192.168.86.195:3000/${uuid}/activity`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;
        
    } catch(error) {
        console.error("Error loading user activity", error);
        throw new Error(`loadUserActivity failed: ${error.message}`);
    }
}

