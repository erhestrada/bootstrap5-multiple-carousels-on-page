const boxArtWidth = 200;
const boxArtHeight = 200;

export async function getTopCategories() {
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
        //const topCategories = clipsData.data.map((pojo) => pojo.name);
        const boxArtUrls = clipsData.data.map((pojo) => pojo.box_art_url);
        //const gameIds = clipsData.data.map((pojo) => pojo.id);
        return boxArtUrls;

    } catch (error) {
        console.error(error);
    }
}

async function makeBrowseGrid() {
    const boxArtUrls = await getTopCategories();
    boxArtUrls.forEach((boxArtUrl) => addBoxArtToGrid(boxArtUrl));
    console.log(boxArtUrls);
}

function addBoxArtToGrid(boxArtUrl) {
    const categoryDiv = `
        <div class="category-wrapper">
            <img src=${boxArtUrl.replace("{width}", boxArtWidth).replace("{height}", boxArtHeight)} alt="category"/>
        </div>
        `;

    document.body.insertAdjacentHTML('beforeend', categoryDiv);
}

makeBrowseGrid();