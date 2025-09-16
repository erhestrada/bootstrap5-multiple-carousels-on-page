const comments = [
    {
        id: 1,
        avatar: "M",
        username: "MemeLord2024",
        verified: true,
        time: "2 hours ago",
        text: "This is absolutely INSANE! How is this even possible?? 🤯",
        likes: 2847,
        replies: [
            {
                avatar: "J",
                username: "JustVibing",
                time: "1 hour ago",
                text: "Fr this broke my brain",
                likes: 156
            },
            {
                avatar: "T",
                username: "TechExplainer",
                verified: true,
                time: "45 min ago",
                text: "Actually, the physics behind this is pretty straightforward if you understand quantum mechanics...",
                likes: 89
            }
        ],
        pinned: true
    },
    {
        id: 2,
        avatar: "S",
        username: "SkepticalSarah",
        time: "4 hours ago",
        text: "Okay but can we talk about how this is literally changing everything? Like, the implications are wild",
        likes: 1205,
        replies: []
    },
    {
        id: 3,
        avatar: "F",
        username: "FirstTimeWatcher",
        time: "6 hours ago",
        text: "WAIT WHAT?! I had to watch this 10 times 😱😱😱",
        likes: 892,
        replies: [
            {
                avatar: "R",
                username: "ReactionKing",
                time: "5 hours ago",
                text: "Same! My jaw is still on the floor",
                likes: 45
            }
        ]
    },
    {
        id: 4,
        avatar: "H",
        username: "Hater123",
        time: "8 hours ago",
        text: "This is fake af. You can literally see the editing at 0:23. Stop falling for this stuff people 🙄",
        likes: -23,
        replies: [
            {
                avatar: "D",
                username: "DebunkThis",
                time: "7 hours ago",
                text: "@Hater123 Actually I analyzed the footage frame by frame and it's legit",
                likes: 234
            },
            {
                avatar: "N",
                username: "NeverSatisfied",
                time: "6 hours ago",
                text: "Some people just can't appreciate art when they see it smh",
                likes: 67
            }
        ]
    },
    {
        id: 5,
        avatar: "G",
        username: "GrandmaWatching",
        time: "12 hours ago",
        text: "My grandson showed me this and I don't understand it but you kids are so creative these days! ❤️👵",
        likes: 5692,
        replies: [
            {
                avatar: "W",
                username: "WholesomeVibes",
                time: "11 hours ago",
                text: "Grandma you're the real MVP 🥺❤️",
                likes: 892
            }
        ]
    },
    {
        id: 6,
        avatar: "C",
        username: "CringeCritic",
        time: "1 day ago",
        text: "why is everyone freaking out about this? it's literally not that deep...",
        likes: 12,
        replies: []
    },
    {
        id: 7,
        avatar: "P",
        username: "PhilosophyBro",
        time: "1 day ago",
        text: "This makes me question the very nature of reality. Are we all just living in a simulation? What is real anymore?",
        likes: 445,
        replies: [
            {
                avatar: "R",
                username: "RealityCheck",
                time: "23 hours ago",
                text: "Bro it's just a video, chill 😅",
                likes: 178
            }
        ]
    }
];

export function renderComments() {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';

        const repliesHTML = comment.replies.map(reply => `
            <div class="reply">
                <div class="comment-main">
                    <div class="avatar">${reply.avatar}</div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="username">${reply.username}</span>
                            <span class="timestamp">${reply.time}</span>
                        </div>
                        <div class="comment-text">${reply.text}</div>
                        <div class="comment-actions-row">
                            <button class="action-btn like-btn">
                                ❤️ <span>${reply.likes}</span>
                            </button>
                            <button class="action-btn show-reply-btn">💬 Reply</button>
                            ${reply.username === 'You' ? '<button class="action-btn delete-btn">🗑️ Delete</button>' : ''}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        commentElement.innerHTML = `
            <div class="comment-main">
                <div class="avatar">${comment.avatar}</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="username">${comment.username}</span>
                        <span class="timestamp">${comment.time}</span>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-actions-row">
                        <button class="action-btn like-btn">
                            ❤️ <span>${Math.abs(comment.likes)}</span>
                        </button>
                        <button class="action-btn show-reply-btn">💬 Reply</button>
                        ${comment.username === 'You' ? '<button class="action-btn delete-btn"">🗑️ Delete</button>' : ''}
                    </div>
                    ${comment.replies.length > 0 ? `<div class="replies">${repliesHTML}</div>` : ''}
                </div>
            </div>
        `;

        commentsList.appendChild(commentElement);
    });
    attachEventListeners();
}

function showReplyBox(button) {
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
                <div class="avatar" style="width: 32px; height: 32px; font-size: 14px;">Y</div>
                <textarea class="reply-textarea" placeholder="Write a reply..."></textarea>
            </div>
            <div class="reply-buttons">
                <button class="reply-btn cancel-btn">Cancel</button>
                <button class="reply-btn actual-reply-btn">Reply</button>
            </div>
        `;
        commentContent.appendChild(replyBox);

        const replyBtn = replyBox.querySelector('.actual-reply-btn');
        replyBtn.addEventListener('click', () => postReply(replyBtn));

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

function postReply(button) {
    const replyBox = button.closest('.reply-box');
    const textarea = replyBox.querySelector('.reply-textarea');
    const replyText = textarea.value.trim();
    
    if (replyText) {
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
                <div class="avatar">Y</div>
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="username">You</span>
                        <span class="timestamp">now</span>
                    </div>
                    <div class="comment-text">${replyText}</div>
                    <div class="comment-actions-row">
                        <button class="action-btn like-btn">
                            ❤️ <span>0</span>
                        </button>
                        <button class="action-btn show-reply-btn">💬 Reply</button>
                        <button class="action-btn delete-btn" onclick="deleteComment(this)">🗑️ Delete</button>
                    </div>
                </div>
            </div>
        `;
        
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
            deleteBtn.addEventListener('click', () => deleteComment(replyBtn));
        }

        textarea.value = '';
        replyBox.style.display = 'none';
    }
}

function toggleLike(button) {
    const isLiked = button.classList.contains('liked');
    const likeCount = button.querySelector('span');
    let count = parseInt(likeCount.textContent);
    
    if (isLiked) {
        button.classList.remove('liked');
        count--;
    } else {
        button.classList.add('liked');
        count++;
    }
    
    likeCount.textContent = count;
}

function addEmoji(emoji) {
    const textarea = document.getElementById('new-comment');
    textarea.value += emoji;
    textarea.focus();
}

function postComment() {
    const textarea = document.getElementById('new-comment');
    const commentText = textarea.value.trim();
    
    if (commentText) {
        const newComment = {
            id: comments.length + 1,
            avatar: "Y",
            username: "You",
            time: "now",
            text: commentText,
            likes: 0,
            replies: []
        };
        
        comments.unshift(newComment);
        textarea.value = '';
        renderComments();
        
        // Update comment count
        const countElement = document.getElementById('comment-count');
        countElement.textContent = parseInt(countElement.textContent) + 1;
    }
}

let pendingDeleteElement = null;

function deleteComment(button) {
    pendingDeleteElement = button;
    showDeleteModal();
}

function showDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.add('show');
}

function hideDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('show');
    pendingDeleteElement = null;
}

function confirmDelete() {
    if (pendingDeleteElement) {
        const commentElement = pendingDeleteElement.closest('.comment');
        const replyElement = pendingDeleteElement.closest('.reply');
        
        if (replyElement && !commentElement) {
            // Deleting a reply (make sure it's not also inside a main comment)
            replyElement.remove();
        } else if (commentElement) {
            // Deleting a main comment
            const commentId = parseInt(commentElement.getAttribute('data-comment-id'));
            const commentIndex = comments.findIndex(c => c.id === commentId);
            if (commentIndex !== -1) {
                comments.splice(commentIndex, 1);
                // Update comment count
                const countElement = document.getElementById('comment-count');
                countElement.textContent = parseInt(countElement.textContent) - 1;
            }
            commentElement.remove();
        }
    }
    hideDeleteModal();
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
        btn.addEventListener('click', () => deleteComment(btn));
    });

}

// Allow Enter to post comment
document.getElementById('new-comment').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        postComment();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const postBtn = document.querySelector('.comment-btn');
    postBtn.addEventListener('click', postComment);

    const deleteCancelButton = document.querySelector('.delete-modal-btn.delete-cancel');
    deleteCancelButton.addEventListener('click', hideDeleteModal);

    const deleteConfirmButton = document.querySelector('.delete-modal-btn.delete-confirm');
    deleteConfirmButton.addEventListener('click', confirmDelete);
});

