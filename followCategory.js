export async function followCategory(category) {    
    const categoryData = await getCategories(category);

    let followedCategories = JSON.parse(localStorage.getItem('followedCategories')) || {};

    if (!(category in followedCategories)) {
        followedCategories[category] = {'boxArtUrl': categoryData.data[0].box_art_url, 'categoryId': categoryData.data[0].id};
    }
    
    localStorage.setItem('followedCategories', JSON.stringify(followedCategories));

    return followedCategories;
}

export async function getCategories(query) {
    try {
        const url = "https://api.twitch.tv/helix/search/categories?query=" + encodeURIComponent(query);  
        //const url = "https://api.twitch.tv/helix/search/games?query=" + encodeURIComponent(query);  
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Client-Id': clientId,
            'Authorization': 'Bearer ' + authToken
        }
        });

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
    }
}
