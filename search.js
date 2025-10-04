import Fuse from 'fuse.js';
import { followStreamer } from './followStreamer.js';
import { makeSearchCarousel } from './makeSearchCarousel.js';

let debounceTimeout;

export async function searchStreamers() {
    const query = document.getElementById('searchBox').value.toLowerCase();  // Get the search input

    // If the query is empty, clear the results and exit
    if (query === '') {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';
        return;
    }

    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(async () => {    
        const searchResults = await getStreamers(query);
        const categorySearchResults = await getCategories(query);

        const formattedStreamerSearchResults = searchResults.data.map(searchResult => ({ name: searchResult.display_name, id: searchResult.id, thumbnailUrl: searchResult.thumbnail_url, type: "streamer" }));
        const formattedCategorySearchResults = categorySearchResults.data.map(searchResult => ({ name: searchResult.name, id: searchResult.id, thumbnailUrl: searchResult.box_art_url, type: "category" }));

        const scoredStreamers = addSimilarityScores(formattedStreamerSearchResults, query);
        const scoredCategories = addSimilarityScores(formattedCategorySearchResults, query);
        
        const combinedSearchResults = [...scoredStreamers, ...scoredCategories];

        // If result of compare function is < 0 a comes before b, > 0 a comes after b, else no change
        combinedSearchResults.sort((a, b) => b.score - a.score);
        const truncatedResults = combinedSearchResults.slice(0, 10);
    
        const resultsContainer = document.getElementById('search-results');
        
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }

        displayResults(truncatedResults, resultsContainer);
    
    }, 200);

}

function addSimilarityScores(results, query) {
    const fuse = new Fuse(results, {
        keys: ['name'],
        includeScore: true,
        threshold: 0.4 // Adjust for strictness: lower = stricter
    });

    const searchResults = fuse.search(query);

    // Format search results
    return searchResults.map(({ item, score }) => ({
        ...item,
        score: 1 - score // Invert because Fuse gives lower score for better matches
    }));
}

function displayResults(searchResults, resultsContainer) {
    searchResults.forEach(({ name, id, thumbnailUrl, type }) => {
        const pfpUrl = thumbnailUrl;
        const streamerId = id;

        const searchResultElement = document.createElement('div');
        searchResultElement.classList.add('search-result');
        searchResultElement.style.cursor = "pointer";
        searchResultElement.addEventListener('click', () => makeSearchCarousel(name, id, thumbnailUrl, type));

        const pfpElement = document.createElement('img');
        pfpElement.src = pfpUrl;

        if (type === "streamer") {
            pfpElement.classList.add('streamer-pfp');  // Add a class for styling
        } else {
            pfpElement.classList.add('category-search-result-boxart');
        }

        const streamerNameElement = document.createElement('p');
        streamerNameElement.innerText = name;
        streamerNameElement.classList.add('streamer-name');  // Add a class for styling

        const followButton = document.createElement('button');
        followButton.innerText = 'Follow';
        followButton.addEventListener('click', () => followStreamer(name, streamerId));

        searchResultElement.appendChild(pfpElement);
        searchResultElement.appendChild(streamerNameElement);
        //searchResultElement.appendChild(followButton);

        resultsContainer.appendChild(searchResultElement);
    });
}

export async function getStreamers(searchInput) {
    try {
        const url = "https://api.twitch.tv/helix/search/channels?query=" + encodeURIComponent(searchInput);  
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

export async function getPfp(streamerId) {
    try {
        const userUrl = "https://api.twitch.tv/helix/users?id=" + streamerId;  
        const response = await fetch(userUrl, {
        method: 'GET',
        headers: {
            'Client-Id': clientId,
            'Authorization': 'Bearer ' + authToken
        }
        });

        const userData = await response.json();
        const pfpUrl = userData.data[0].profile_image_url;
        return pfpUrl

    } catch (error) {
        console.error(error);
    }
}

export async function getCategories(searchInput) {
    try {
        const url = "https://api.twitch.tv/helix/search/categories?query=" + encodeURIComponent(searchInput);
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

const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('keyup', searchStreamers);
