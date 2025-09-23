import { toggleLike } from "./like-handler";
import { handleDeleteComment } from "./delete-comment-handler";

export function showReplyBox(button) {
    document.querySelectorAll('.reply-box').forEach(box => {
        box.style.display = 'none';
    });

    const commentContent = button.closest('.comment-content');
    let replyBox = commentContent.querySelector('.reply-box');

    const usernameEl = commentContent.querySelector('.username');
    const username = usernameEl ? usernameEl.textContent.trim() : '';

    if (!replyBox) {
        replyBox = document.createElement('div');
        replyBox.className = 'reply-box';
        replyBox.innerHTML = `
            <div class="reply-input">
                <div class="avatar" style="width: 32px; height: 32px; font-size: 14px;"></div>
                <textarea class="reply-textarea" placeholder="Write a reply..."></textarea>
            </div>
            <div class="reply-buttons">
                <button class="reply-btn cancel-btn">Cancel</button>
                <button class="reply-btn actual-reply-btn">Reply</button>
            </div>
        `;
        commentContent.appendChild(replyBox);

        const replyBtn = replyBox.querySelector('.actual-reply-btn');
        replyBtn.addEventListener('click', () => handleReply(replyBtn));

        const cancelBtn = replyBox.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => hideReplyBox(cancelBtn));
    }

    replyBox.style.display = 'block';

    const textarea = replyBox.querySelector('.reply-textarea');

    // Only prefill @username if replying to a reply (i.e. inside .reply)
    const isReplyToReply = button.closest('.reply') !== null;
    if (isReplyToReply && username) {
        textarea.value = `@${username} `;
    } else {
        textarea.value = '';
    }

    textarea.focus();
}

function hideReplyBox(button) {
    const replyBox = button.closest('.reply-box');
    const replyTextarea = replyBox.querySelector('.reply-textarea');
    replyTextarea.value = '';
    replyBox.style.display = 'none';
}

function handleReply(button) {
    const replyBox = button.closest('.reply-box');
    const textarea = replyBox.querySelector('.reply-textarea');
    const replyText = textarea.value.trim();
    
    if (replyText) {
        const newComment = {
            id: window.clipComments.length + 1,
            username: window.username,
            timestamp: new Date().toISOString(),
            comment: replyText,
            likes: 0,
            replies: []
        };

        const parentId = button.dataset.commentId;
        postComment(window.userId, window.currentClip.id, parentId, commentText, newComment.likes);
        window.clipComments.unshift(newComment); // I don't think this is the right nested format

        // Update comment count
        const countElement = document.getElementById('comment-count');
        countElement.textContent = parseInt(countElement.textContent) + 1;

        const commentContent = replyBox.closest('.comment-content');

        let parentComment = button.closest('.comment');
        let repliesContainer = parentComment.querySelector('.replies');
        
        if (!repliesContainer) {
            repliesContainer = document.createElement('div');
            repliesContainer.className = 'replies';
            commentContent.appendChild(repliesContainer);
        }
        
        const newReply = document.createElement('div');
        newReply.className = 'reply';
        newReply.innerHTML = `
            <div class="comment-main">
                <div class="avatar"></div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="username">${window.username}</span>
                        <span class="timestamp">now</span>
                    </div>
                    <div class="comment-text">${replyText}</div>
                    <div class="comment-actions-row">
                        <button class="action-btn like-btn">
                            ❤️ <span>0</span>
                        </button>
                        <button class="action-btn show-reply-btn">💬 Reply</button>
                        <button class="action-btn delete-btn" onclick="handleDeleteComment(this)">🗑️ Delete</button>
                    </div>
                </div>
            </div>
        `;
        
        // Update DOM
        repliesContainer.appendChild(newReply);

        const likeBtn = newReply.querySelector('.like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', () => toggleLike(likeBtn));
        }
        
        const replyBtn = newReply.querySelector('.show-reply-btn');
        if (replyBtn) {
            replyBtn.addEventListener('click', () => showReplyBox(replyBtn));
        }

        const deleteBtn = newReply.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => handleDeleteComment(replyBtn));
        }

        textarea.value = '';
        replyBox.style.display = 'none';
    }
}
