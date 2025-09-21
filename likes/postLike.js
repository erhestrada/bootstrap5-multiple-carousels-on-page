import { makeApiRequest } from "../make-api-request";

export default async function postLike(userId, clipId, commentId) {
    const url = `http://192.168.86.195:3000/${userId}/clips/${clipId}/${commentId}/likes`;
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };
    const data = await makeApiRequest(url, options);
    return data;
}
