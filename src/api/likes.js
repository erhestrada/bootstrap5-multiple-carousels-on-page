import { makeApiRequest } from "../make-api-request";

export async function postLike(userId, clipId, commentId) {
    const url = `http://192.168.86.195:3000/${userId}/clips/${clipId}/${commentId}/likes`;
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };
    const data = await makeApiRequest(url, options);
    return data;
}
import { makeApiRequest } from "../make-api-request";

export async function deleteLike(userId, clipId, commentId) {
    const url = `http://192.168.86.195:3000/${userId}/clips/${clipId}/${commentId}/likes`;
    const options = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };    const data = makeApiRequest(url, options);
    return data;
}
