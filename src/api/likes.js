import { makeApiRequest } from "../../make-api-request.js";

export async function postLike(userId, clipId, commentId) {
    const url = API_URL + `${userId}/clips/${clipId}/${commentId}/likes`;
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };
    const data = await makeApiRequest(url, options);
    return data;
}

export async function deleteLike(userId, clipId, commentId) {
    const url = API_URL + `${userId}/clips/${clipId}/${commentId}/likes`;
    const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };    const data = makeApiRequest(url, options);
    return data;
}
