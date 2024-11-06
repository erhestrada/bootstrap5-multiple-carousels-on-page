// on click open clip player

let debounceTimeout;

async function searchStreamers() {
    const query = document.getElementById('searchBox').value.toLowerCase();  // Get the search input

    // If the query is empty, clear the results and exit
    if (query === '') {
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';  // Clear the results container
        return;  // Exit the function early
    }


    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(async () => {    
        const searchResults = await getStreamers(query);
        const streamerNames = searchResults.data.map(searchResult => searchResult.broadcaster_login);
        const streamerIds = searchResults.data.map(searchResult => searchResult.id);
    
        // Wait for all profile pictures to be fetched
        const pfpUrls = await Promise.all(streamerIds.map(streamerId => getPfp(streamerId)));
    
        console.log(searchResults);
        console.log(streamerNames);
        console.log(pfpUrls);
    
        const resultsContainer = document.getElementById('results');
        
        if (resultsContainer) {
            resultsContainer.innerHTML = '';  // Clear the container before appending new content
        }
    
        streamerNames.forEach((streamerName, index) => {
            const pfpUrl = pfpUrls[index];
    
            // Create a new div for each streamer entry
            const streamerEntryElement = document.createElement('div');
            streamerEntryElement.classList.add('streamer-entry');  // Add a class for styling
    
            // Create and set the image element
            const pfpElement = document.createElement('img');
            pfpElement.src = pfpUrl;
            pfpElement.classList.add('streamer-pfp');  // Add a class for styling
    
            // Create and set the name element
            const streamerNameElement = document.createElement('p');
            streamerNameElement.innerText = streamerName;
            streamerNameElement.classList.add('streamer-name');  // Add a class for styling
    
            // Append the image and name to the entry element
            streamerEntryElement.appendChild(pfpElement);
            streamerEntryElement.appendChild(streamerNameElement);
    
            // Finally, append the entry to the results container
            resultsContainer.appendChild(streamerEntryElement);
        });
    
    }, 500);

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



const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('keyup', searchStreamers);