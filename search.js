// display streamer name and pfp
// on click open clip player

let debounceTimeout;

async function searchStreamers() {
    const query = document.getElementById('searchBox').value.toLowerCase();  // Get the search input

    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(async () => {
        const searchResults = await getStreamers(query);
        const streamerNames = searchResults.data.map(searchResult => searchResult.broadcaster_login);
        const streamerIds = searchResults.data.map(searchResult => searchResult.id);
        
        console.log(searchResults);
        console.log(streamerNames);
    
        const resultsContainer = document.getElementById('results');
        for (const streamerName of streamerNames) {
            resultsContainer.innerHTML += `<p>${streamerName}</p>`;
        }
        // Display what the user is typing in the results container
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
        document.querySelector('.pfp-image').src = userData.data[0].profile_image_url;

    } catch (error) {
        console.error(error);
    }
}



const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('keyup', searchStreamers);