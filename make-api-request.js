export async function makeApiRequest(url, options) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorMessage = `HTTP error; status: ${response.status}`;

      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage += ` - ${errorData.message}`;
        }
      } catch {
        // JSON parsing error
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err) {
    console.error('API Request failed:', err);
    throw err;
  }
}
