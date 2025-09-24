import { toggleLike } from "./like-handler";
import { handleDeleteComment } from "./delete-comment-handler";
import { postComment } from "../comments";

export function showReplyBox(button) {
    document.querySelectorAll('.reply-box').forEach(box => {
        box.style.display = 'none';
    });

    const parentId = button.dataset.commentId;

    const commentContent = button.closest('.comment-content');
    let replyBox = commentContent.querySelector('.reply-box');

    const usernameEl = commentContent.querySelector('.username');
    const username = usernameEl ? usernameEl.textContent.trim() : '';

    let replyBtn;
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
                <button class="reply-btn submit-reply-btn">Reply</button>
            </div>
        `;
        commentContent.appendChild(replyBox);

        replyBtn = replyBox.querySelector('.submit-reply-btn');
        replyBtn.addEventListener('click', async () => await handleReply(replyBtn, parentId));

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

    // Submit comment when enter pressed
    textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleReply(replyBtn, parentId);
        }
    });
}

function hideReplyBox(button) {
    const replyBox = button.closest('.reply-box');
    const replyTextarea = replyBox.querySelector('.reply-textarea');
    replyTextarea.value = '';
    replyBox.style.display = 'none';
}

async function handleReply(button, parentId) {
    const replyBox = button.closest('.reply-box');
    const textarea = replyBox.querySelector('.reply-textarea');
    const replyText = textarea.value.trim();
    
    if (replyText) {
        console.log('Parent id? ', parentId);
        const commentId = await postComment(window.userId, window.currentClip.id, parentId, replyText);

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
                        <span class="timestamp">${new Date().toISOString()}</span>
                    </div>
                    <div class="comment-text">${replyText}</div>
                    <div class="comment-actions-row">
                        <button class="action-btn like-btn">
                            ❤️ <span>0</span>
                        </button>
                        <button class="action-btn show-reply-btn" data-comment-id="${commentId}">💬 Reply</button>
                        <button class="action-btn delete-btn" onclick="handleDeleteComment(this)">🗑️ Delete</button>
                    </div>
                </div>
            </div>
        `;
        
        // Update DOM
        repliesContainer.appendChild(newReply);
        attachCommentEventListeners(newReply, textarea);

        textarea.value = '';
        replyBox.style.display = 'none';
    }
}

function attachCommentEventListeners(comment, textarea) {
    const likeBtn = comment.querySelector('.like-btn');
    if (likeBtn) {
        likeBtn.addEventListener('click', () => toggleLike(likeBtn));
    }
    
    const replyBtn = comment.querySelector('.show-reply-btn');
    if (replyBtn) {
        replyBtn.addEventListener('click', () => showReplyBox(replyBtn));
    }

    const deleteBtn = comment.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => handleDeleteComment(deleteBtn));
    }
}
