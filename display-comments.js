import { getComments } from "./comments";

// Need to do more stuff, like comment-handler
export async function displayComments(clipId) {
    const comments = await getComments(clipId);
    console.log(comments);
    return comments;
}
