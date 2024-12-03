import { makeBrowseCarouselForCategory } from "./makeBrowseCarouselForCategory";
import { closePopUp } from "./getTopClipsBrowse";
import { saveClip } from "./saveClip";
import { searchCategories } from "./searchCategories";
import { followBrowseCategory } from "./followCategory";

const boxArtWidth = 200;
const boxArtHeight = 200;

let isLoading = false; // To prevent multiple fetches

// Function to load more items
async function addItems() {
    if (isLoading) return; // Prevent multiple fetches
    isLoading = true; // Set loading state

    const [boxArtUrls, nextCursor] = await getTopCategories(window.nextCursor);
    boxArtUrls.forEach((boxArtUrl) => addBoxArtToGrid(boxArtUrl));

    // Set the next cursor for future requests
    window.nextCursor = nextCursor;

    isLoading = false; // Reset loading state after fetch
}


export async function getTopCategories(cursor=false) {
    try {
        let url = '';
        if (cursor===false) {
            url = "https://api.twitch.tv/helix/games/top?first=100";
        } else {
            url = "https://api.twitch.tv/helix/games/top?first=100&after=" + cursor;
        }
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
        const gameIds = clipsData.data.map((pojo) => pojo.id);
        
        const topCategoriesData = topCategories.reduce((acc, _, i) => {
            acc.push(
                {'category': topCategories[i],
                 'gameId': gameIds[i],
                 'boxArtUrl': boxArtUrls[i]
                });
            return acc;
        }, []);

        const nextCursor = clipsData.pagination.cursor;
        window.nextCursor = nextCursor;
        //console.log(currentCursor);
        return [topCategoriesData, nextCursor];

    } catch (error) {
        console.error(error);
    }
}

async function makeBrowseGrid(cursor=false) {
    const [topCategoriesData, nextCursor] = await getTopCategories(cursor);
    topCategoriesData.forEach((topCategoryData) => addBoxArtToGrid(topCategoryData));
    /*
    if (nextCursor) {
        makeBrowseGrid(nextCursor)
    }*/
}

function addBoxArtToGrid(topCategoryData) {
    const {category, gameId, boxArtUrl} = topCategoryData;
    const categoryDiv = `
        <div class="category-wrapper" data-category="${category}" data-game-id="${gameId}" data-box-art-url="${boxArtUrl}">
            <img src=${boxArtUrl.replace("{width}", boxArtWidth).replace("{height}", boxArtHeight)} alt="category"/>
        </div>
        `;

    const parentElement = document.getElementById('categories-to-browse');
    parentElement.insertAdjacentHTML('beforeend', categoryDiv);

    // Select the newly added category wrapper and add the event listener
    const newCategoryPic = parentElement.lastElementChild; // Get the last added element
    newCategoryPic.addEventListener('click', () => {
        makeBrowseCarouselForCategory(newCategoryPic.dataset.category, newCategoryPic.dataset.gameId, newCategoryPic.dataset.boxArtUrl);
    });
}

// Function to create infinite scroll
export function createInfiniteScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        addItems(); // Load more items when scrolled near the bottom
    }
}

// Add scroll event listener
window.addEventListener('scroll', createInfiniteScroll);

// Initial load
await makeBrowseGrid(); // Load initial items

const categoryPics = document.querySelectorAll('.category-wrapper');
categoryPics.forEach(categoryPic => {
    categoryPic.addEventListener('click', () => makeBrowseCarouselForCategory(categoryPic.dataset.category, categoryPic.dataset.gameId, categoryPic.dataset.boxArtUrl));
    window.category = categoryPic.dataset.category;
    window.gameId = categoryPic.dataset.gameId;
    window.boxArtUrl = categoryPic.dataset.boxArtUrl;
})

document.querySelector('.close').addEventListener('click', closePopUp);
document.getElementById('favorite-button').addEventListener('click', () => saveClip("favorited-clips"));
document.getElementById('follow-category-button').addEventListener('click', () => followBrowseCategory(window.category, window.gameId, window.boxArtUrl));

const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('keyup', searchCategories);