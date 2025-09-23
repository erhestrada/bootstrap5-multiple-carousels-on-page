import { toggleLike } from "./like-handler";
import { showReplyBox } from './reply-handler';
import { postComment } from '../comments';
import { handleDeleteComment } from "./delete-comment-handler";

export function submitComment() {
    const textarea = document.getElementById('new-comment');
    const commentText = textarea.value.trim();
    
    if (commentText) {
        const newComment = {
            id: window.clipComments.length + 1,
            username: window.username,
            timestamp: new Date().toISOString(),
            comment: commentText,
            likes: 0,
            liked: 0,
            replies: []
        };

        // null because no parentId, this function submits non-reply comment
        // Initialize comment with 0 likes
        postComment(window.userId, window.currentClip.id, null, commentText);
        
        window.clipComments.unshift(newComment);
        textarea.value = '';
        renderComments();
        
        // Update comment count
        const countElement = document.getElementById('comment-count');
        countElement.textContent = parseInt(countElement.textContent) + 1;
    }
}

export function renderComments() {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    window.clipComments.forEach(comment => {
        const repliesHTML = renderReplies(comment.replies);

        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.setAttribute('data-comment-id', comment.id);

        commentElement.innerHTML = `
            <div class="comment-main">
                <div class="avatar"></div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="username">${comment.username}</span>
                        <span class="timestamp">${comment.timestamp}</span>
                    </div>
                    <div class="comment-text">${comment.comment}</div>
                    <div class="comment-actions-row">
                        <button class="action-btn like-btn ${comment.liked ? 'liked' : ''}" data-comment-id="${comment.id}">
                            ❤️ <span>${comment.likes}</span>
                        </button>
                        <button class="action-btn show-reply-btn" data-comment-id="${comment.id}">💬 Reply</button>
                        ${comment.username === window.username ? `<button class="action-btn delete-btn" data-comment-id="${comment.id}">🗑️ Delete</button>` : ''}
                    </div>
                    ${repliesHTML ? `<div class="replies">${repliesHTML}</div>` : ''}
                </div>
            </div>
        `;

        commentsList.appendChild(commentElement);
    });

    attachEventListeners();
}

function renderReplies(replies) {
    // Flatten nested replies into a single array
    let allReplies = [];

    function collectReplies(replyList) {
        replyList.forEach(r => {
            allReplies.push(r);
            if (r.replies && r.replies.length > 0) {
                collectReplies(r.replies); // recursion but only to collect
            }
        });
    }

    collectReplies(replies);

    return allReplies.map(reply => `
        <div class="reply">
            <div class="comment-main">
                <div class="avatar"></div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="username">${reply.username}</span>
                        <span class="timestamp">${reply.timestamp}</span>
                    </div>
                    <div class="comment-text">${reply.comment}</div>
                    <div class="comment-actions-row">
                        <button class="action-btn like-btn ${reply.liked ? 'liked' : ''}" data-comment-id="${reply.id}">
                            ❤️ <span>${reply.likes}</span>
                        </button>
                        <button class="action-btn show-reply-btn" data-comment-id="${reply.id}">💬 Reply</button>
                        ${reply.username === window.username ? `<button class="action-btn delete-btn" data-comment-id="${reply.id}">🗑️ Delete</button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function attachEventListeners() {
    const likeBtns = document.querySelectorAll('.like-btn');
    likeBtns.forEach(btn => {
        btn.addEventListener('click', () => toggleLike(btn));
    });

    const replyBtns = document.querySelectorAll('.show-reply-btn');
    replyBtns.forEach(btn => {
        btn.addEventListener('click', () => showReplyBox(btn));
    });

    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => handleDeleteComment(btn));
    });
}
