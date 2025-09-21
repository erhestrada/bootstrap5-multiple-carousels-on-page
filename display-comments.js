import { getComments } from "./comments";
import { renderComments } from "./comment-handlers/comment-handler";

export async function displayComments(clipId) {
    const comments = await getComments(clipId);
    console.log('comments: ', comments);
    displayNumberOfComments(comments);
    renderComments();
    return comments;
}

function displayNumberOfComments(comments) {
    const commentCountElement = document.getElementById('comment-count');
    commentCountElement.innerText = comments.length;    
}
