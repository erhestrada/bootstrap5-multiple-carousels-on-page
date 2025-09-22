import { getComments } from "./comments";
import { renderComments } from "./comment-handlers/comment-handler";

export async function displayComments(clipId, userId) {
    const comments = await getComments(clipId, userId);
    console.log('comments: ', comments);
    window.clipComments = comments;
    displayNumberOfComments(comments);
    renderComments();
    return comments;
}

function displayNumberOfComments(comments) {
    const commentCountElement = document.getElementById('comment-count');
    commentCountElement.innerText = comments.length;    
}
