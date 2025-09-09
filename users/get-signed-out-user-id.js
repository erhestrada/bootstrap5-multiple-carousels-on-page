// Rename to getSignedOutUserId
export default async function getSignedOutUserId(clientId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/signed-out-user-id?clientId=${clientId}`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const userId = await response.json();
        return userId;

    } catch (error) {
        console.error('Error loading userId', error);
        return null;
    }
}
