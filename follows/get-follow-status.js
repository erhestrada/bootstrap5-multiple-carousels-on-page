export default async function getFollowStatus(userId, streamerOrCategory) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/users/${userId}/following/${streamerOrCategory}`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const followingData = await response.json();
        const following = followingData.following ?? false; // If user hasn't followed return false
        return following;

    } catch (error) {
        console.error('Error getting user favorite on clip', error);
        return false; // Assume default value of false if error getting following status
    }
}
