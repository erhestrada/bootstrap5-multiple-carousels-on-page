import {makeCarouselForCategory} from './makeCarouselForCategory.js'

export async function makeTopCategoriesCarousels() {
    try {
        const url = "https://api.twitch.tv/helix/games/top";
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Client-Id': clientId,
            'Authorization': 'Bearer ' + authToken
        }
        });

        const clipsData = await response.json();
        const topCategories = clipsData.data.map((pojo) => pojo.name);
        const boxArtUrls = clipsData.data.map((pojo) => pojo.box_art_url);
        console.log(boxArtUrls);
        topCategories.forEach((category, index) => makeCarouselForCategory(category, boxArtUrls[index]));

    } catch (error) {
        console.error(error);
    }
}
