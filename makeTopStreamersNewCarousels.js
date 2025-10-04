import { makeNewCarouselForStreamer } from "./makeNewCarouselForStreamer";

export async function makeTopStreamersNewCarousels() {
    try {
        const topEnglishStreamsData = await getTopStreamsInLanguage("en");
        for (const stream of topEnglishStreamsData) {
            const streamer = stream.user_name;
            const twitchId = stream.user_id;
            const profilePictureUrl = stream.thumbnail_url;
            makeNewCarouselForStreamer(streamer, twitchId, profilePictureUrl);
        }
    } catch (error) {
        console.error("Error in making top streamers carousels:", error);
    }
}

async function getTopStreamsInLanguage(language = "en") {
    const topStreams = await getTopStreams();
    const topStreamsInLanguage = topStreams.data.filter(stream => stream.language === language);
    return topStreamsInLanguage;
}

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

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Twitch API Error:", errorData);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch failed:", error);
        return null;
    }
}
