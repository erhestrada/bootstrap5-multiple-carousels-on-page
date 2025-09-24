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

        const element = replyElement || commentElement;
        const commentText = element.querySelector('.comment-text')?.textContent.trim() || '';
        
        if (replyElement && commentElement) {
            // Deleting a reply (make sure it's not also inside a main comment)
            replyElement.remove();
            const commentId = replyElement.dataset.commentId;
            deleteComment(window.userId, window.currentClip.id, commentId);
            console.log('Deleting here - good');
            
        } else if (commentElement) {
            // Deleting a main comment
            const commentId = parseInt(commentElement.getAttribute('data-comment-id'));
            console.log('comment id: ', commentId);
            const commentIndex = window.clipComments.findIndex(c => c.id === commentId);
            if (commentIndex !== -1) {
                window.clipComments.splice(commentIndex, 1);
                // Update comment count
                const countElement = document.getElementById('comment-count');
                countElement.textContent = parseInt(countElement.textContent) - 1;
            }
            commentElement.remove();
            console.log('Deleting here - bad');
            deleteComment(window.userId, window.currentClip.id, commentId);
        }
    }
    hideDeleteModal();
    console.log(window.clipComments);
}
