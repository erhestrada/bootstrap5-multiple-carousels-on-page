// modifying this first to work for just streamerFollow
export default async function postFollow(userId, streamer, twitchId) {
    try {
        // app.post('/users/:userId/following/streamers/:streamer/:twitchId', (req, res) => {
        const url = `http://192.168.86.195:3000/users/${userId}/following/streamers/${streamer}/${twitchId}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const followingData = await response.json();
        const following = followingData.following ?? false;
        return following;

    } catch (error) {
        console.error('Error getting follow status:', error);
        return false;
    }
}
