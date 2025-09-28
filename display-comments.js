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

function displayNumberOfComments(deletedCommentPlaceholder = '[deleted]') {
    const commentCountElement = document.getElementById('comment-count');
    
    const comments = Array.from(document.querySelectorAll('.comment'));
    const nonDeletedComments = comments.filter(comment => comment.querySelector('.comment-text').textContent !== deletedCommentPlaceholder);
    
    const replies = document.querySelectorAll('.reply');

    const commentCount = nonDeletedComments.length + replies.length;
    commentCountElement.innerText = commentCount;    
}
