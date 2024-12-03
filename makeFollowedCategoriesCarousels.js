import {makeCarouselForCategory} from './makeCarouselForCategory.js'

export async function makeFollowedCategoriesCarousels() {
    const categoriesCarousels = document.getElementById('categories-carousels');
    categoriesCarousels.innerHTML = '';

    const followedCategoriesData = JSON.parse(localStorage.getItem('followedCategories')) || {};
    let followedCategories = [];
    let boxArtUrls = [];
    let gameIds = [];

    for (const [followedCategory, categoryData] of Object.entries(followedCategoriesData)) {
        const {boxArtUrl, categoryId} = categoryData;
        followedCategories.push(followedCategory);
        boxArtUrls.push(boxArtUrl);
        gameIds.push(categoryId);
    }

    followedCategories.forEach((category, index) => makeCarouselForCategory(category, gameIds[index], boxArtUrls[index]));
}