import {getCurrentDateTime} from './getTopClips'
import {getPastDateTime} from './getTopClips'
import { makeClipsCarouselFromClipsData } from "./getTopClips";

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
        makeClipsCarouselFromClipsData(clipsData, "streamer-bar-carousel");

    } catch (error) {
        console.error(error);
    }
}

