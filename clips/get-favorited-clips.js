export default async function getFavoritedClips(userId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/clips/${userId}/favorites`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const votesData = await response.json();
        return votesData;

    } catch (error) {
        console.error('Error getting favorited clips', error);
        return null;
    }
}
