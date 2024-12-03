import {makeCarouselForCategory} from './makeCarouselForCategory.js'

// i just need to be storing the boxArtUrls and the gameIds when i store the category

export async function makeFollowedCategoriesCarousels() {
    console.log('HELLOOOOOOO');
    const categoriesCarousels = document.getElementById('categories-carousels');
    categoriesCarousels.innerHTML = '';

    window.clipsData[carouselName] = clipsData;
    window.currentClipPosition = {'game': carouselName, 'index': 0};

    const followedCategories = localStorage.getItem('followedCategories') || [];
    for (const category in followedCategories) {
        const boxArtUrl = window.clipsData[category].boxArtUrl;
        const gameId = window.clipsData[category].gameId;
    }
    const boxArtUrls = '';
    const gameIds = '';

    //followedCategories.forEach((category, index) => makeCarouselForCategory(category, gameIds[index], boxArtUrls[index]));


}