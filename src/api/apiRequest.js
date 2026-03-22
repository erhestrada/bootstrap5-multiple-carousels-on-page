import { API_URL } from "./apiConfig.js";

export async function apiRequest(path, options) {
  const url = new URL(path, API_URL);

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

