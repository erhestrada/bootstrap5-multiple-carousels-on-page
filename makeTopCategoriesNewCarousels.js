import {makeNewCarouselForCategory} from './makeNewCarouselForCategory.js'

// pageNumber x 20

export async function makeTopCategoriesNewCarousels(pageNumber) {
    try {
        const url = "https://api.twitch.tv/helix/games/top?first=100";
        const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Client-Id': clientId,
            'Authorization': 'Bearer ' + authToken
        }
        });

        const clipsData = await response.json();
        window.topCategoriesClipsData = clipsData.data;
        const topCategories = clipsData.data.map((pojo) => pojo.name);
        window.orderedCarousels = topCategories;
        const boxArtUrls = clipsData.data.map((pojo) => pojo.box_art_url);

        window.boxArtUrls = clipsData.data.reduce((acc, pojo) => {
            acc[pojo.name] = pojo.box_art_url;
            return acc;
        }, {});

        const gameIds = clipsData.data.map((pojo) => pojo.id);
        topCategories.forEach((category, index) => makeNewCarouselForCategory(category, gameIds[index], boxArtUrls[index]));

    } catch (error) {
        console.error(error);
    }
}
