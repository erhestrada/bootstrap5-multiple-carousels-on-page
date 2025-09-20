import { postLike, deleteLike } from '../likes';

export function toggleLike(button) {
    const isLiked = button.classList.contains('liked');
    const likeCount = button.querySelector('span');
    let count = parseInt(likeCount.textContent);
    
    if (isLiked) {
        deleteLike(window.userId, window.currentClip.id, button.dataset.commentId);
        button.classList.remove('liked');
        count--;
    } else {
        postLike(window.userId, window.currentClip.id, button.dataset.commentId);
        button.classList.add('liked');
        count++;
    }
    
    likeCount.textContent = count;
}
