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
        document.querySelector('.pfp-image').src = userData.data[0].profile_image_url;

    } catch (error) {
        console.error(error);
    }
}

