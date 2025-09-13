export default async function deleteFollow(userId, name, label) {
    try {
        if (!['streamer', 'category'].includes(label)) {
            throw new Error('Invalid label');
        }

        const url = `http://192.168.86.195:3000/users/${userId}/following/${label}/${name}`;
        const response = await fetch(url, {
            method: 'DELETE',
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
