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
        return null;
    }
}