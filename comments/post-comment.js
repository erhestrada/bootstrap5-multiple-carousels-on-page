import { makeApiRequest } from "../make-api-request";

export default async function postComment(userId, clipId, parentId, comment) {
    const url = `http://192.168.86.195:3000/clips/${clipId}/comments`;
    const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId, parentId, comment}),
        };
    const commentIdData = await makeApiRequest(url, options);
    const commentId = commentIdData.id;
    return commentId;
}
