import {makeCarouselForCategory} from './makeCarouselForCategory.js'

// i just need to be storing the boxArtUrls and the gameIds when i store the category

export async function makeFollowedCategoriesCarousels() {
    console.log('HELLOOOOOOO');
    const categoriesCarousels = document.getElementById('categories-carousels');
    categoriesCarousels.innerHTML = '';

    const followedCategories = localStorage.getItem('followedCategories') || [];
    const boxArtUrls = clipsData.data.map((pojo) => pojo.box_art_url);
    const gameIds = clipsData.data.map((pojo) => pojo.id);

    //followedCategories.forEach((category, index) => makeCarouselForCategory(category, gameIds[index], boxArtUrls[index]));


}