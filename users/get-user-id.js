export default async function getUserId(clientId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/users?clientId=${clientId}&signedOut=true`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const userId = response.json();
        return userId;

    } catch (error) {
        console.error('Error loading userId', error);
        return null;
    }
}
