import { makeNewCarouselForCategory } from './makeNewCarouselForCategory.js';

export async function makeFollowingCarousels() {
    const categoriesCarousels = document.getElementById('categories-carousels');
    categoriesCarousels.innerHTML = '';

    const followedCategoriesData = window.follows.categories || [];

    followedCategoriesData.forEach(({ category, twitch_id, box_art_url }) => {
        makeNewCarouselForCategory(category, twitch_id, box_art_url);
    });
}
