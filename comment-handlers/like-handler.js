export function toggleLike(button) {
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
