import { API_URL } from "./apiConfig.js";

// modifying this first to work for just categoryFollow
export async function deleteCategoryFollow(userId, category, twitchId, boxArtUrl) {
    try {
        const url = API_URL + `follows/users/${userId}/categories/${category}`;
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
export async function deleteStreamerFollow(userId, streamer, twitchId) {
    try {
        const url = API_URL + `follows/users/${userId}/streamers/${streamer}`;
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
export async function getFollows(userId) {
    try {
        const url = API_URL + `follows/users/${userId}`;
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

// TODO: delete, unused
// label e.g. streamer, category
export async function getKindOfFollows(userId, kind) {
    try {
        if (!['streamers', 'categories'].includes(kind)) {
            throw new Error('Kind must be streamers or categories');
        }

        const url = API_URL + `follows/users/${userId}/${kind}`;
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
export async function patchSwapPositions(userId, followType, firstStreamerOrCategoryName, secondStreamerOrCategoryName) {
    try {
        // followType should be 'streamers' or 'categories'
        const url = API_URL + `follows/users/${userId}/${followType}`;
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
export async function postCategoryFollow(userId, category, twitchId, boxArtUrl) {
    try {
        const url = API_URL + `follows/users/${userId}/categories/${category}`;
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
export async function postStreamerFollow(userId, streamer, twitchId, profilePictureUrl) {
    try {
        const url = API_URL + `follows/users/${userId}/streamers/${streamer}`;
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

