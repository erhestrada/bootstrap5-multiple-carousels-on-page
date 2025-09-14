// label e.g. streamer, category
export default async function postFollow(userId, name, kind) {
    try {
        if (!['streamer', 'category'].includes(kind)) {
            throw new Error('Invalid kind');
        }

        const url = `http://192.168.86.195:3000/users/${userId}/following/${kind}/${name}`;
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
