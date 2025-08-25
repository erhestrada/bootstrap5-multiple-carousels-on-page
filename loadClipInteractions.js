// also need to load total votes

export function loadClipInteractions(clip) {
    const upvotedClips = JSON.parse(localStorage.getItem('upvotedClips') || '[]');
    const downvotedClips = JSON.parse(localStorage.getItem('downvotedClips') || '[]');
    const favoritedClips = JSON.parse(localStorage.getItem('favoritedClips') || '[]');

    const upvoteButton = document.getElementById('upvote-button');
    const downvoteButton = document.getElementById('downvote-button');
    const favoriteButton = document.getElementById('favorite-button');

    console.log(upvotedClips, downvotedClips, favoritedClips);
    console.log(clip);
    console.log(upvotedClips.some(upvotedClip => upvotedClip.id === clip.id));

    highlightElement(clip, upvotedClips, upvoteButton, 'vote');
    highlightElement(clip, downvotedClips, downvoteButton, 'vote');
    highlightElement(clip, favoritedClips, favoriteButton, 'favorite');
}

function highlightElement(clip, memory, element, category) {
    if (memory.some(element => element.id === clip.id)) {
        if (category === 'vote') {
            element.classList.add('voted');
        } else if (category === 'favorite') {
            element.classList.add('voted');
        }
    }
}


