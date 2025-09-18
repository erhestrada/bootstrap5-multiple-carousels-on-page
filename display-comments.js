import { getComments } from "./comments";
import { renderComments } from "./comment-handlers/comment-handler";

// Need to do more stuff, like comment-handler
export async function displayComments(clipId) {
    const comments = await getComments(clipId);
    console.log('comments: ', comments);
    renderComments(comments);
    return comments;
}
