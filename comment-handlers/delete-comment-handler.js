import { deleteComment } from "../comments";

let pendingDeleteElement = null;

export function deleteComment(button) {
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

        const element = replyElement || commentElement;
        const commentText = element.querySelector('.comment-text')?.textContent.trim() || '';
        
        if (replyElement && !commentElement) {
            // Deleting a reply (make sure it's not also inside a main comment)
            replyElement.remove();
            deleteComment(window.userId, window.currentClip.id, null, commentText);
            
        } else if (commentElement) {
            // Deleting a main comment
            const commentId = parseInt(commentElement.getAttribute('data-comment-id'));
            const commentIndex = window.clipComments.findIndex(c => c.id === commentId);
            if (commentIndex !== -1) {
                window.clipComments.splice(commentIndex, 1);
                // Update comment count
                const countElement = document.getElementById('comment-count');
                countElement.textContent = parseInt(countElement.textContent) - 1;
            }
            commentElement.remove();
            deleteComment(window.userId, window.currentClip.id, null, commentText);
        }
    }
    hideDeleteModal();
}
