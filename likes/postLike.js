import { makeApiRequest } from "../make-api-request";

export default async function postLike(userId, clipId, commentId) {
    const url = `/${userId}/clips/${clipId}/${commentId}/likes`;
    const options = {};
    const data = makeApiRequest(url, options);
    return data;
}
