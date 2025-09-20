// Rename to getSignedOutUserId
export default async function getSignedOutUser(clientId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/signed-out-user?clientId=${clientId}`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const userData = await response.json();
        const { userId, username } = userData;
        return { userId, username };

    } catch (error) {
        console.error('Error loading userId', error);
        return null;
    }
}
