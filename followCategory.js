import { displayHeart } from "./display-follow-status.js";
import { postCategoryFollow, deleteCategoryFollow } from './follows';

export async function followCategory(userId, category) {    
    let followedCategories = JSON.parse(localStorage.getItem('followedCategories')) || {};
    const [boxArtUrl, categoryId] = getBoxArtUrlAndIdForCategory(category);

    if (!(category in followedCategories)) {
        followedCategories[category] = {'boxArtUrl': boxArtUrl, 'categoryId': categoryId};
        postCategoryFollow(userId, category, categoryId);
    } else {
        delete followedCategories[category];
        deleteCategoryFollow(userId, category, categoryId);
    }
    
    localStorage.setItem('followedCategories', JSON.stringify(followedCategories));
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