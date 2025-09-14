// label e.g. streamer, category
export default async function getFollows(userId, kind) {
    try {
        if (!['streamers', 'categories'].includes(kind)) {
            throw new Error('Kind must be streamers or categories');
        }

        const url = `http://192.168.86.195:3000/users/${userId}/following/${kind}`;
        const response = await fetch(url);

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
