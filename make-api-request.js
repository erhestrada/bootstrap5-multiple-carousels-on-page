export async function makeApiRequest(url, options) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error; status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('API Request failed:', err);
    throw err;
  }
}
