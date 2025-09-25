import { deleteComment } from "../comments";

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
        
        if (replyElement && commentElement) {
            replyElement.remove();
            const commentId = replyElement.dataset.commentId;
            deleteComment(window.userId, window.currentClip.id, commentId);
            
        } else if (commentElement) {
            // Deleting a main comment
            const commentId = parseInt(commentElement.getAttribute('data-comment-id'));
            console.log('comment id: ', commentId);
            const commentIndex = window.clipComments.findIndex(c => c.id === commentId);
            if (commentIndex !== -1) {
                window.clipComments.splice(commentIndex, 1);
            }
            if (!commentElement.querySelector('.reply')) {
                commentElement.remove();
            } else {
                let commentText = commentElement.querySelector('.comment-text');
                commentText.innerText = '[deleted]';
                deleteComment(window.userId, window.currentClip.id, commentId);
            }
        }

        // Update comment count
        const countElement = document.getElementById('comment-count');
        countElement.textContent = parseInt(countElement.textContent) - 1;
    }
    hideDeleteModal();
    console.log(window.clipComments);
}
