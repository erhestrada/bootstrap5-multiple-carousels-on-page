import { makeApiRequest } from "../make-api-request";

export default async function deleteComment(userId, clipId, commentId) {
    const url = `http://192.168.86.195:3000/clips/${clipId}/comments/${commentId}`;
    const options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId }),
        };
    const response = await makeApiRequest(url, options);
    return response;
}
