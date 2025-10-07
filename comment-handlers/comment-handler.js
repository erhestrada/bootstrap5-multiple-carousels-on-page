import { toggleLike } from "./like-handler";
import { showReplyBox } from './reply-handler';
import { postComment } from '../comments';
import { handleDeleteComment } from "./delete-comment-handler";
import { postClip } from "../postClip";

export async function submitComment() {
    const textarea = document.getElementById('new-comment');
    const commentText = textarea.value.trim();
    
    if (commentText) {
        const newComment = {
            id: null,
            username: window.username,
            timestamp: new Date().toISOString(),
            comment: commentText,
            likes: 0,
            liked: 0,
            replies: []
        };

        const parentId = null; // Top level comments have no parent
        const commentId = await postComment(window.userId, window.currentClip.id, parentId, commentText);
        postClip(window.currentClip);
        newComment.id = commentId;
        
        window.clipComments.unshift(newComment);
        textarea.value = '';
        renderComment(newComment);
        
        // Update comment count
        const countElement = document.getElementById('comment-count');
        countElement.textContent = parseInt(countElement.textContent) + 1;
    }
}

function renderComment(comment) {
    const commentsList = document.getElementById('comments-list');

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
            </div>
        </div>
    `;

    commentsList.prepend(commentElement);
    attachCommentEventListeners(commentElement);
}

export function renderComments(deletedCommentPlaceholder = "[deleted]") {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    window.clipComments.forEach(comment => {
        const repliesHTML = renderReplies(comment.replies);

        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.setAttribute('data-comment-id', comment.id);

        let avatarHTML = '';
        let headerHTML = '';
        let actionsHTML = '';

        if (comment.comment !== deletedCommentPlaceholder) {
            avatarHTML = `<div class="avatar"></div>`;
            headerHTML = `
                <div class="comment-header">
                    <span class="username">${comment.username}</span>
                    <span class="timestamp">${comment.timestamp}</span>
                </div>
            `;
            actionsHTML = `
                <div class="comment-actions-row">
                    <button class="action-btn like-btn ${comment.liked ? 'liked' : ''}" data-comment-id="${comment.id}">
                        ❤️ <span>${comment.likes}</span>
                    </button>
                    <button class="action-btn show-reply-btn" data-comment-id="${comment.id}">💬 Reply</button>
                    ${comment.username === window.username ? `<button class="action-btn delete-btn" data-comment-id="${comment.id}">🗑️ Delete</button>` : ''}
                </div>
            `;
        }

        commentElement.innerHTML = `
            <div class="comment-main">
                ${avatarHTML}
                <div class="comment-content">
                    ${headerHTML}
                    <div class="comment-text">${comment.comment}</div>
                    ${actionsHTML}
                    ${repliesHTML ? `<div class="replies">${repliesHTML}</div>` : ''}
                </div>
            </div>
        `;

        commentsList.appendChild(commentElement);
    });

    attachEventListeners();
}

function renderReplies(replies, deletedCommentPlaceholder = "[deleted]") {
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

    const nonDeletedReplies = allReplies.filter(reply => reply.comment !== deletedCommentPlaceholder);

    return nonDeletedReplies.map(reply => `
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

    // Submit comment when enter pressed
    const textarea = document.getElementById('new-comment');
    if (textarea) {
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submitComment();
            }
        });
    }
}

export function attachCommentEventListeners(comment) {
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
