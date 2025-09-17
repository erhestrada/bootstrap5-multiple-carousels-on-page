import { makeApiRequest } from "../make-api-request";

export default async function deleteComment(userId, clipId, parentId, comment) {
    const url = `http://192.168.86.195:3000/clips/${clipId}/comments`;
    const options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId, parentId, comment }),
        };
    const response = await makeApiRequest(url, options);
    return response;
}
