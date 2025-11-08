export default async function patchSwapPositions(userId, followType, firstStreamerOrCategoryName, secondStreamerOrCategoryName) {
    try {
        // followType should be 'streamers' or 'categories'
        const url = `http://192.168.86.195:3000/users/${userId}/following/${followType}`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ firstStreamerOrCategoryName, secondStreamerOrCategoryName }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        //const responseData = await response.json();
        //return responseData;

    } catch (error) {
        console.error('Error following streamer:', error);
        return false;
    }
}
