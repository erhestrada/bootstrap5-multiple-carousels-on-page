export default async function patchSwapPositions(userId, followType, firstStreamerOrCategoryName, secondStreamerOrCategoryName) {
    try {
        const url = `http://192.168.86.195:3000/users/${userId}/following/streamers/${streamer}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ twitchId, profilePictureUrl }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const followingData = await response.json();
        const following = followingData.following ?? false;
        return following;

    } catch (error) {
        console.error('Error following streamer:', error);
        return false;
    }
}
