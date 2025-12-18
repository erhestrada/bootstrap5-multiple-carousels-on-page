import { clientId, authToken } from './config.js';

export async function updateDonutPfp(streamerId) {
    try {
        const userUrl = "https://api.twitch.tv/helix/users?id=" + streamerId;  
        const response = await fetch(userUrl, {
        method: 'GET',
        headers: {
            'Client-Id': clientId,
            'Authorization': 'Bearer ' + authToken
        }
        });

        const userData = await response.json();
        const profilePictureUrl = userData.data[0].profile_image_url;
        document.querySelector('.pfp-image').src = profilePictureUrl;
        window.profilePictureUrl = profilePictureUrl;

    } catch (error) {
        console.error(error);
    }
}

