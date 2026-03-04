export default async function deleteFavorite(userId, clipId) {
    try {
        const response = await fetch('http://192.168.86.195:3000/favorites', {
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
        console.error("Error deleting favorite from database", error);
    }
}
export default async function getFavoriteStatusOfClip(userId, clipId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/favorites/${userId}/${clipId}`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const favoritedData = await response.json();
        const favorited = favoritedData.favorited ?? false; // If user hasn't favorited the clip favorited is false
        return favorited;

    } catch (error) {
        console.error('Error getting user favorite on clip', error);
        return false; // Assume default value of false if error getting favorited status
    }
}
export default async function postFavorite(userId, clipId) {
    try {
        const response = await fetch('http://192.168.86.195:3000/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId, clipId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const voteId = await response.json();
        return voteId;
    
    } catch(error) {
        console.error("Error posting favorite to database", error);
    }
}
