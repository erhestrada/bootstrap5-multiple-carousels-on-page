export default async function getVotedOnClips(userId) {
    try {
        const response = await fetch(`http://192.168.86.195:3000/clips/${userId}/comments`);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const commentedOnClips = await response.json();
        console.log(commentedOnClips);
        return commentedOnClips;

    } catch (error) {
        console.error('Error getting commented on clips', error);
        return null;
    }
}
