import { makeApiRequest } from "../../make-api-request.js";
import { API_URL } from "./apiConfig.js";

export async function deleteComment(userId, clipId, commentId) {
    const url = API_URL + `comments/clips/${clipId}/${commentId}`;
    const options = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId }),
        };
    const response = await makeApiRequest(url, options);
    return response;
}

export async function getComments(clipId, userId) {
    // TODO: refactor path
    const url = API_URL + `abc/clips/${clipId}/comments?userId=${userId}`;
    const options = {};
    const comments = await makeApiRequest(url, options);
    return comments;
}

export async function postComment(userId, clipId, parentId, comment) {
    const url = API_URL + `comments/clips/${clipId}`;
    const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ userId, parentId, comment}),
        };
    const commentIdData = await makeApiRequest(url, options);
    const commentId = commentIdData.id;
    return commentId;
}

export async function softDeleteComment(clipId, commentId) {
    const url = API_URL + `clips/${clipId}/comments/${commentId}`;
    const options = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            userId: null,
            comment: '[deleted]',
            timestamp: null
        })
    };

    const response = await makeApiRequest(url, options);
    return response;
}
