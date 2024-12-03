export async function followCategory(category) {    
    let followedCategories = JSON.parse(localStorage.getItem('followedCategories')) || {};

    if (!(category in followedCategories)) {
        const boxArtUrlAndId = getBoxArtUrlAndIdForCategory(category);
        followedCategories[category] = {'boxArtUrl': boxArtUrlAndId[0], 'categoryId': boxArtUrlAndId[1]};
    }
    
    localStorage.setItem('followedCategories', JSON.stringify(followedCategories));

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