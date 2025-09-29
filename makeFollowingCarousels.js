import { makeNewCarouselForCategory } from './makeNewCarouselForCategory.js';
import { makeNewCarouselForStreamer } from './makeNewCarouselForStreamer.js';

export async function makeFollowingCarousels({ categories = false, streamers = false } = {}) {
    const categoriesCarousels = document.getElementById('categories-carousels');
    categoriesCarousels.innerHTML = '';

    if (categories) {
        const followedCategoriesData = window.follows.categories || [];
        followedCategoriesData.forEach(({ category, twitch_id, box_art_url }) => {
            makeNewCarouselForCategory(category, twitch_id, box_art_url);
        });
    } else if (streamers) {
        const followedStreamersData = window.follows.streamers || [];
        followedStreamersData.forEach(({ streamer, twitch_id }) => {
            makeNewCarouselForStreamer(streamer, twitch_id);
        });
    }
}
