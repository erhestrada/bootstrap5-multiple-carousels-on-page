export function followCategory(category) {    
    let followedCategories = JSON.parse(localStorage.getItem('followedCategories')) || {};

    if (!(category in followedCategories)) {
        followedCategories.push(category);
    }
    localStorage.setItem('followedCategories', JSON.stringify(followedCategories));
    
    return followedStreamers;
}
