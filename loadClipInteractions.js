// also need to load total votes

export function loadClipInteractions(clip) {
    const upvotedClips = JSON.parse(localStorage.getItem('upvotedClips') || '[]');
    const downvotedClips = JSON.parse(localStorage.getItem('downvotedClips') || '[]');
    const favoritedClips = JSON.parse(localStorage.getItem('favoritedClips') || '[]');

    const upvoteButton = document.getElementById('upvote-button');
    const downvoteButton = document.getElementById('downvote-button');
    const favoriteButton = document.getElementById('favorite-button');

    highlightElement(clip, upvotedClips, upvoteButton, 'vote');
    highlightElement(clip, downvotedClips, downvoteButton, 'vote');
    highlightElement(clip, favoritedClips, favoriteButton, 'favorite');
}

function highlightElement(clip, memory, button, category) {
    if (memory.some(element => element.id === clip.id)) {
        if (category === 'vote') {
            const voteIcon = button.querySelector('.vote-icon');
            voteIcon.classList.add('voted');
        } else if (category === 'favorite') {
            const favoriteIcon = button.querySelector('.favorite-icon');
            favoriteIcon.classList.remove('bi-star');
            favoriteIcon.classList.add('bi-star-fill');
            favoriteIcon.classList.add('favorited');
        }
    }
}
