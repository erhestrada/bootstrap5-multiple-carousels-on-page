import { deleteComment, softDeleteComment } from "../comments";

let pendingDeleteElement = null;

export function handleDeleteComment(button) {
    pendingDeleteElement = button;
    showDeleteModal();
}

function showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.add('show');
}

export function hideDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('show');
    pendingDeleteElement = null;
}

export function confirmDelete() {
    if (pendingDeleteElement) {
        const commentElement = pendingDeleteElement.closest('.comment');
        const replyElement = pendingDeleteElement.closest('.reply');
        
        if (replyElement) {
            const commentId = replyElement.dataset.commentId;

            const replyElements = Array.from(document.querySelectorAll('.reply'));
            const childOfReplyElement = replyElements.find(replyElement => replyElement.dataset.parentId === commentId);

            // If replyElement has no children, remove it
            if (!childOfReplyElement) {
                replyElement.remove();
                deleteComment(window.userId, window.currentClip.id, commentId);
            // If replyElement has a child, replace with [deleted]
            } else {
                displayDeletedSign(replyElement);
                softDeleteComment(window.currentClip.id, commentId);
            }
            
        } else if (commentElement) {
            // Deleting a top level comment
            const commentId = parseInt(commentElement.getAttribute('data-comment-id'));
            const commentIndex = window.clipComments.findIndex(c => c.id === commentId);
            if (commentIndex !== -1) {
                window.clipComments.splice(commentIndex, 1);
            }

            // If comment has no replies, remove the whole element otherwise replace with [deleted]
            if (!commentElement.querySelector('.reply')) {
                commentElement.remove();
                deleteComment(window.userId, window.currentClip.id, commentId);
            } else {
                displayDeletedSign(commentElement);
                softDeleteComment(window.currentClip.id, commentId);
            }
        }

        // Update comment count
        const countElement = document.getElementById('comment-count');
        countElement.textContent = parseInt(countElement.textContent) - 1;
    }
    hideDeleteModal();
    console.log(window.clipComments);
}

function displayDeletedSign(commentElement) {
    let commentText = commentElement.querySelector('.comment-text');
    commentText.innerText = '[deleted]';

    let commentAvatar = commentElement.querySelector('.avatar');
    commentAvatar.remove();

    let header = commentElement.querySelector('.comment-header');
    header.remove();

    let actionsRow = commentElement.querySelector('.comment-actions-row');
    actionsRow.remove();
}
