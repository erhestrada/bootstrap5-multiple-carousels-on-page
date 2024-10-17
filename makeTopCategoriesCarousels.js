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

        // also get the box art
        const clipsData = await response.json();
        const topCategories = clipsData.data.map((pojo) => pojo.name);
        console.log(topCategories);

    } catch (error) {
        console.error(error);
    }
}
