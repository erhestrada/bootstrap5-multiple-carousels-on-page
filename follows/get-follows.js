// label e.g. streamer, category
export default async function getFollows(userId) {
    try {
        const url = `http://192.168.86.195:3000/users/${userId}/following`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const follows = await response.json();
        console.log('follows: ', follows);
        return follows;

    } catch (error) {
        console.error('Error getting follows', error);
        return [];
    }
}
