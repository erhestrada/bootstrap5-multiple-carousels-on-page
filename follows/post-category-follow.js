// modifying this first to work for just categoryFollow
export default async function postCategoryFollow(userId, category, twitchId, boxArtUrl) {
    try {
        // app.post('/users/:userId/following/categorys/:category/:twitchId', (req, res) => {
        const url = `http://192.168.86.195:3000/users/${userId}/following/categories/${category}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ twitchId, boxArtUrl }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const followingData = await response.json();
        const following = followingData.following ?? false;
        return following;

    } catch (error) {
        console.error('Error following category:', error);
        return false;
    }
}
