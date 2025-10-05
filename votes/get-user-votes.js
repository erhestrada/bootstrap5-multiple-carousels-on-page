export default async function getUserVotes(userId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/votes/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const votesData = await response.json();
        return votesData;

    } catch (error) {
        console.error('Error getting user votes', error);
        return null;
    }
}
