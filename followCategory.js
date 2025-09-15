import { displayHeart } from "./display-follow-status.js";
import { postCategoryFollow, deleteCategoryFollow } from './follows';

export async function followCategory(userId, category) {    
    const followedCategories = window.follows.categories.map(({ category }) => category);
    const [boxArtUrl, categoryId] = getBoxArtUrlAndIdForCategory(category);

    if (!followedCategories.includes(category)) {
        window.follows.categories.push({ category, categoryId, boxArtUrl });
        postCategoryFollow(userId, category, categoryId, boxArtUrl);
    } else {
        window.follows.categories = window.follows.categories.filter(followedCategory => followedCategory.category !== category);
        deleteCategoryFollow(userId, category, categoryId, boxArtUrl);
    }
    
    displayHeart('follow-category-button', category, followedCategories);

    return followedCategories;
}

function getBoxArtUrlAndIdForCategory(category) {
    for (const categoryClipsData of window.topCategoriesClipsData) {
        if (category === categoryClipsData.name) {
            const boxArtUrl = categoryClipsData.box_art_url;
            const id = categoryClipsData.id;
            return [boxArtUrl, id];
        }
    }
    
    return ['', ''];
}

export async function followBrowseCategory(category, gameId, boxArtUrl) {
    let followedCategories = JSON.parse(localStorage.getItem('followedCategories')) || {};

    if (!(category in followedCategories)) {
        followedCategories[category] = {'boxArtUrl': boxArtUrl, 'categoryId': gameId};
    }
    
    localStorage.setItem('followedCategories', JSON.stringify(followedCategories));

    return followedCategories;
}