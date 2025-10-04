import { makeNewCarouselForStreamer } from "./makeNewCarouselForStreamer";

export async function makeTopStreamersNewCarousels() {
    try {
        //const topEnglishStreamsData = getTopStreamersInLanguage("en");
        const topStreams = await getTopStreams();
        const topEnglishStreamsData = topStreams.data.filter(stream => stream.language === "en");
        for (const stream of topEnglishStreamsData) {
            const streamer = stream.user_name;
            const twitchId = stream.user_id;
            const profilePictureUrl = stream.thumbnail_url;
            makeNewCarouselForStreamer(streamer, twitchId, profilePictureUrl)
        }
    } catch (error) {
        console.error(error);
    }
}

async function getTopStreamersInLanguage(language = "en") {
    const topStreams = await getTopStreams(); // {data: Array(100), pagination: {…}}
    const topEnglishStreams = topStreams.data.filter(stream => stream.language === "en");
    return topEnglishStreams;
}

/*
Example stream object
{
    "id": "315318555736",
    "user_id": "552120296",
    "user_login": "zackrawrr",
    "user_name": "zackrawrr",
    "game_id": "509658",
    "game_name": "Just Chatting",
    "type": "live",
    "title": "[DROPS ON] BIG DAY HUGE DRAMA MEGABONK TOMORROW BIG NEWS AND GAMES MULTISTREAMING+REACTS | Follow My 24/7 channel @asmongold247",
    "viewer_count": 40566,
    "started_at": "2025-10-03T17:54:01Z",
    "language": "en",
    "thumbnail_url": "https://static-cdn.jtvnw.net/previews-ttv/live_user_zackrawrr-{width}x{height}.jpg",
    "tag_ids": [],
    "tags": [
        "English",
        "politics",
        "bald",
        "DropsEnabled"
    ],
    "is_mature": false
}
*/
async function getTopStreams() {
    try {
        const url = "https://api.twitch.tv/helix/streams?first=100";
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Client-Id': clientId,
            'Authorization': 'Bearer ' + authToken
        }
        });

        const topStreamersData = await response.json();
        return topStreamersData;
    } catch (error) {
        console.error(error);
    }  
}
