import { API_URL } from "./apiConfig.js";

export async function postUser(uuid) {
    try {
        const response = await fetch(API_URL + 'postUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uuid })
        });
        const result = await response.json();
        console.log('Data Stored:', result);

    } catch (error) {
        console.error('Error storing data:', error);
    }
};

// Rename to getSignedOutUserId
export async function getSignedOutUser(clientId) {
    try {
        const response = await fetch(API_URL + `users/signed-out-user?clientId=${clientId}`);

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
