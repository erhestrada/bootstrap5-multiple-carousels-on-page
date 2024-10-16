import {getCurrentDateTime} from './getTopClips'
import {getPastDateTime} from './getTopClips'
import { makeClipsCarouselFromClipsData } from './getTopClips';

export async function updateStreamerBarCarousel(streamerId) {
    try {
        const currentDateTime = getCurrentDateTime();
        const pastDateTime = getPastDateTime(1);
        const url = "https://api.twitch.tv/helix/clips?broadcaster_id=" + streamerId + "&started_at=" + pastDateTime + "&ended_at=" + currentDateTime;
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Client-Id': clientId,
            'Authorization': 'Bearer ' + authToken
        }
        });

        const clipsData = await response.json();
        makeClipsCarouselFromClipsData(clipsData, 'carousel2-inner', 'carousel2');
        document.querySelector('.pfp-image').src = userData.data[0].profile_image_url;

    } catch (error) {
        console.error(error);
    }
}

