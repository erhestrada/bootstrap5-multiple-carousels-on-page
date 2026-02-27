// modifying this first to work for just categoryFollow
export default async function deleteCategoryFollow(userId, category, twitchId, boxArtUrl) {
    try {
        // app.post('/users/:userId/following/categorys/:category/:twitchId', (req, res) => {
        const url = `http://192.168.86.195:3000/users/${userId}/following/categories/${category}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ twitchId, boxArtUrl }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const followingData = await response.json();
        const following = followingData.following ?? false;
        return following;

    } catch (error) {
        console.error('Error unfollowing category:', error);
        return false;
    }
}
// modifying this first to work for just streamerFollow
export default async function deleteStreamerFollow(userId, streamer, twitchId) {
    try {
        // app.post('/users/:userId/following/streamers/:streamer/:twitchId', (req, res) => {
        const url = `http://192.168.86.195:3000/users/${userId}/following/streamers/${streamer}`;
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ twitchId }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const followingData = await response.json();
        const following = followingData.following ?? false;
        return following;

    } catch (error) {
        console.error('Error unfollowing streamer:', error);
        return false;
    }
}
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
// label e.g. streamer, category
export default async function getKindOfFollows(userId, kind) {
    try {
        if (!['streamers', 'categories'].includes(kind)) {
            throw new Error('Kind must be streamers or categories');
        }

        const url = `http://192.168.86.195:3000/users/${userId}/following/${kind}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const followingData = await response.json();
        const follows = followingData[kind];
        return follows;

    } catch (error) {
        console.error('Error getting follow status:', error);
        return [];
    }
}
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
// modifying this first to work for just categoryFollow
export default async function postCategoryFollow(userId, category, twitchId, boxArtUrl) {
    try {
        // app.post('/users/:userId/following/categorys/:category/:twitchId', (req, res) => {
        const url = `http://192.168.86.195:3000/users/${userId}/following/categories/${category}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ twitchId, boxArtUrl }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const followingData = await response.json();
        const following = followingData.following ?? false;
        return following;

    } catch (error) {
        console.error('Error following category:', error);
        return false;
    }
}
// modifying this first to work for just streamerFollow
export default async function postStreamerFollow(userId, streamer, twitchId, profilePictureUrl) {
    try {
        // app.post('/users/:userId/following/streamers/:streamer/:twitchId', (req, res) => {
        const url = `http://192.168.86.195:3000/users/${userId}/following/streamers/${streamer}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ twitchId, profilePictureUrl }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error; status: ${response.status}`);
        }

        const followingData = await response.json();
        const following = followingData.following ?? false;
        return following;

    } catch (error) {
        console.error('Error following streamer:', error);
        return false;
    }
}
