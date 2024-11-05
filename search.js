// display streamer name and pfp
// on click open clip player

let debounceTimeout;

async function searchStreamers() {
    const query = document.getElementById('searchBox').value.toLowerCase();  // Get the search input

    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(async () => {
        const searchResults = await getStreamers(query);
        console.log(searchResults);
    
        const resultsContainer = document.getElementById('results');
        // Display what the user is typing in the results container
        resultsContainer.innerHTML = `<p>${query}</p>`;
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


const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('keyup', searchStreamers);