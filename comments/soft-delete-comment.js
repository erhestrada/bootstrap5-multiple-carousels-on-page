import { makeApiRequest } from "../make-api-request";

export default async function softDeleteComment(clipId, commentId) {
    const url = `http://192.168.86.195:3000/clips/${clipId}/comments/${commentId}`;
    const options = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: null,
            comment: '[deleted]',
            timestamp: null
        })
    };

    const response = await makeApiRequest(url, options);
    return response;
}
