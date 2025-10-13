import { makeNewCarouselForCategory } from './makeNewCarouselForCategory.js';
import { makeNewCarouselForStreamer } from './makeNewCarouselForStreamer.js';

export async function makeFollowingCarousels({ categories = false, streamers = false, container = null } = {}) {
    if (categories) {
        const followedCategoriesData = window.follows.categories || [];
        followedCategoriesData.forEach(({ category, categoryId, boxArtUrl }) => {
            makeNewCarouselForCategory(category, categoryId, boxArtUrl, container, "following");
        });
    } else if (streamers) {
        const followedStreamersData = window.follows.streamers || [];
        followedStreamersData.forEach(({ streamer, twitch_id, profile_picture_url }) => {
            makeNewCarouselForStreamer(streamer, twitch_id, profile_picture_url, container);
        });
    }
}
