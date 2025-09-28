import { getComments } from "./comments";
import { renderComments } from "./comment-handlers/comment-handler";

export async function displayComments(clipId, userId) {
    const comments = await getComments(clipId, userId);
    console.log('comments: ', comments);
    window.clipComments = comments;
    renderComments();
    displayNumberOfComments();
    return comments;
}

function displayNumberOfComments() {
    const commentCountElement = document.getElementById('comment-count');
    
    const comments = document.querySelectorAll('.comment');
    const replies = document.querySelectorAll('.reply');

    const commentCount = comments.length + replies.length;
    commentCountElement.innerText = commentCount;    
}
