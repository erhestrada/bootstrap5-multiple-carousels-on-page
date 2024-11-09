import { makeBrowseCarouselForCategory } from "./makeBrowseCarouselForCategory";
import { getTopCategories } from "./browse";

let debounceTimeout;

const boxArtWidth = 200;
const boxArtHeight = 200;

export async function searchCategories() {
    const query = document.getElementById('searchBox').value.toLowerCase();  // Get the search input

    // If the query is empty, clear the results and exit
    if (query === '') {
        const resultsContainer = document.getElementById('categories-to-browse');
        resultsContainer.innerHTML = '';  // Clear the results container
        await makeBrowseGrid(); // Load initial items
        return;  // Exit the function early
    }

    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(async () => {    
        const searchResults = await getCategories(query);
        
        const categoryNames = searchResults.data.map(searchResult => searchResult.name);
        const boxArtUrls = searchResults.data.map(searchResult => searchResult.box_art_url);
        
        console.log(categoryNames);
        console.log(boxArtUrls);
    
        const resultsContainer = document.getElementById('categories-to-browse');
        resultsContainer.innerHTML = '';  // Clear the results container
            
        categoryNames.forEach((categoryName, index) => {
            const boxArtUrl = boxArtUrls[index];
    
            // Create a new div for each streamer entry
            const streamerEntryElement = document.createElement('div');
            streamerEntryElement.classList.add('streamer-entry');  // Add a class for styling
    
            // Create and set the image element
            const pfpElement = document.createElement('img');
            pfpElement.src = boxArtUrl;
            pfpElement.classList.add('streamer-pfp');  // Add a class for styling
    
            // Create and set the name element
            const streamerNameElement = document.createElement('p');
            streamerNameElement.innerText = categoryName;
            streamerNameElement.classList.add('streamer-name');  // Add a class for styling

            // Append the image and name to the entry element
            streamerEntryElement.appendChild(pfpElement);
            streamerEntryElement.appendChild(streamerNameElement);
    
            // Finally, append the entry to the results container
            resultsContainer.appendChild(streamerEntryElement);
            
        });
    
    }, 200);

}


async function makeBrowseGrid(cursor=false) {
    const [topCategoriesData, nextCursor] = await getTopCategories(cursor);
    topCategoriesData.forEach((topCategoryData) => addBoxArtToGrid(topCategoryData));
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

////////////////////////////////



export async function getCategories(query) {
    try {
        const url = "https://api.twitch.tv/helix/search/categories?query=" + encodeURIComponent(query);  
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

