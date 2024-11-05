function search() {
    const query = document.getElementById('searchBox').value.toLowerCase();  // Get the search input
    const resultsContainer = document.getElementById('results');
    // Display what the user is typing in the results container
    resultsContainer.innerHTML = `<p>${query}</p>`;
    
    /*
    // Filter the data based on the query
    const filteredData = data.filter(item => item.toLowerCase().includes(query));
    
    // Display the results
    if (filteredData.length > 0) {
      resultsContainer.innerHTML = filteredData.map(item => `<p>${item}</p>`).join('');
    } else {
      resultsContainer.innerHTML = '<p>No results found.</p>';
    }
    */
  }

const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('keyup', search);