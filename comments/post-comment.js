import { makeApiRequest } from "../make-api-request";

export default async function postComment(userId, clipId, parentId, comment, likes) {
    const url = `http://192.168.86.195:3000/clips/${clipId}/comments`;
    const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId, parentId, comment, likes }),
        };
    const comments = makeApiRequest(url, options);
    return comments
}
