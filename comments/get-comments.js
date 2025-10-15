import { makeApiRequest } from "../make-api-request";

export default async function getComments(clipId, userId) {
    // TODO: refactor path
    const url = `http://192.168.86.195:3000/abc/clips/${clipId}/comments?userId=${userId}`;
    const options = {};
    const comments = await makeApiRequest(url, options);
    return comments;
}
