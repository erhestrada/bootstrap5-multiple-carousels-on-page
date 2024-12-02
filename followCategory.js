export function followCategory(category) {    
    console.log(category);
    let followedCategories = JSON.parse(localStorage.getItem('followedCategories')) || [];

    if (!(category in followedCategories)) {
        followedCategories.push(category);
    }
    localStorage.setItem('followedCategories', JSON.stringify(followedCategories));

    console.log(followedCategories);
    return followedCategories;
}
