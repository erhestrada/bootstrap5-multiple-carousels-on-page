export function postComment() {
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
