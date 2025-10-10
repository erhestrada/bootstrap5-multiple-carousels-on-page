import { makeNewCarouselForCategory } from './makeNewCarouselForCategory.js';
import { makeNewCarouselForStreamer } from './makeNewCarouselForStreamer.js';

export async function makeFollowingCarousels({ categories = false, streamers = false, container = null } = {}) {
    const categoriesCarousels = document.getElementById('categories-carousels');
    categoriesCarousels.innerHTML = '';

    if (categories) {
        const followedCategoriesData = window.follows.categories || [];
        console.log("heyo");
        console.log(followedCategoriesData);
        followedCategoriesData.forEach(({ category, categoryId, boxArtUrl }) => {
            console.log(category, categoryId);
            makeNewCarouselForCategory(category, categoryId, boxArtUrl, container);
        });
    } else if (streamers) {
        const followedStreamersData = window.follows.streamers || [];
        followedStreamersData.forEach(({ streamer, twitch_id, profile_picture_url }) => {
            makeNewCarouselForStreamer(streamer, twitch_id, profile_picture_url);
        });
    }
}
