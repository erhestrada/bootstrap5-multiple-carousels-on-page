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
        alert(userData.data[0].display_name);
        console.log(userData);

    } catch (error) {
        console.error(error);
    }
}

// curl -X GET 'https://api.twitch.tv/helix/users?id=141981764' -H 'Authorization: Bearer cfabdegwdoklmawdzdo98xt2fo512y' -H 'Client-Id: uo6dggojyb8d6soh92zknwmi5ej1q2'