const boxArtWidth = 200;
const boxArtHeight = 200;

export async function getTopCategories(cursor=false) {
    try {
        let url = '';
        if (cursor===false) {
            url = "https://api.twitch.tv/helix/games/top?first=100";
        } else {
            url = "https://api.twitch.tv/helix/games/top?first=100&cursor=" + cursor;
        }
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
        const currentCursor = clipsData.pagination.cursor;
        console.log(currentCursor);
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

    const parentElement = document.getElementById('categories-to-browse');
    parentElement.insertAdjacentHTML('beforeend', categoryDiv);
}

makeBrowseGrid();