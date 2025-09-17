import { toggleLike } from "./like-handler";
import { showReplyBox, deleteComment } from "../commentsSection";

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
window.clipComments = comments;

export function postComment(comments) {
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
        renderComments(comments);
        
        // Update comment count
        const countElement = document.getElementById('comment-count');
        countElement.textContent = parseInt(countElement.textContent) + 1;
    }
}

export function renderComments(comments) {
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
                        ${comment.username === 'You' ? '<button class="action-btn delete-btn">🗑️ Delete</button>' : ''}
                    </div>
                    ${comment.replies.length > 0 ? `<div class="replies">${repliesHTML}</div>` : ''}
                </div>
            </div>
        `;

        commentsList.appendChild(commentElement);
    });
    attachEventListeners();
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
