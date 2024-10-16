import {getCurrentDateTime} from './getTopClips'
import {getPastDateTime} from './getTopClips'
import { makeCarousel2FromClipsData } from './getCarousel2Clips';

export async function updateStreamerBarCarousel(streamerId, daysBack = 1) {
    try {
        const currentDateTime = getCurrentDateTime();
        const pastDateTime = getPastDateTime(daysBack);
        const url = "https://api.twitch.tv/helix/clips?broadcaster_id=" + streamerId + "&started_at=" + pastDateTime + "&ended_at=" + currentDateTime;
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Client-Id': clientId,
            'Authorization': 'Bearer ' + authToken
        }
        });

        const clipsData = await response.json();
        makeCarousel2FromClipsData(clipsData, 'carousel2-inner', 'carousel2');
        // why is this working when i take it out?
        //document.querySelector('.pfp-image').src = userData.data[0].profile_image_url;

    } catch (error) {
        console.error(error);
    }
}

